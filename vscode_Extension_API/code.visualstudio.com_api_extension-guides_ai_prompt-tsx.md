Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/extension-guides/ai/prompt-tsx.md "Edit this document in vscode.dev")

# Craft language model prompts

You can build language model prompts by using string concatenation, but it's hard to compose features and make sure your prompts stay within the context window of language models. To overcome these limitations, you can use the [`@vscode/prompt-tsx`](https://github.com/microsoft/vscode-prompt-tsx) library.

The `@vscode/prompt-tsx` library provides the following features:

- **TSX-based prompt rendering**: Compose prompts using TSX components, making them more readable and maintainable
- **Priority-based pruning**: Automatically prune less important parts of prompts to fit within the model's context window
- **Flexible token management**: Use properties like `flexGrow`, `flexReserve`, and `flexBasis` to cooperatively use token budgets
- **Tool integration**: Integrate with VS Code's language model tools API

For a complete overview of all features and detailed usage instructions, refer to the [full README](https://github.com/microsoft/vscode-prompt-tsx/blob/main/README.md).

This article describes practical examples of prompt design with the library. The complete code for these examples can be found in the [prompt-tsx repository](https://github.com/microsoft/vscode-prompt-tsx/tree/main/examples).

## [Manage priorities in the conversation history](https://code.visualstudio.com/api/extension-guides/ai/prompt-tsx\#manage-priorities-in-the-conversation-history)

Including conversation history in your prompt is important as it enables the user to ask follow-up questions to previous messages. However, you want to make sure its priority is treated appropriately because history can grow large over time. We've found that the pattern which makes the most sense is usually to prioritize, in order:

1. The base prompt instructions
2. The current user query
3. The last couple of turns of chat history
4. Any supporting data
5. As much of the remaining history as you can fit

For this reason, split the history into two parts in the prompt, where recent prompt turns are prioritized over general contextual information.

In this library, each TSX node in the tree has a priority that is conceptually similar to a zIndex where a higher number means a higher priority.

### [Step 1: Define the HistoryMessages component](https://code.visualstudio.com/api/extension-guides/ai/prompt-tsx\#step-1-define-the-historymessages-component)

To list history messages, define a `HistoryMessages` component. This example provides a good starting point, but you might have to expand it if you deal with more complex data types.

This example uses the `PrioritizedList` helper component, which automatically assigns ascending or descending priorities to each of its children.

Tsx

```
import {
	UserMessage,
	AssistantMessage,
	PromptElement,
	BasePromptElementProps,
	PrioritizedList,
} from '@vscode/prompt-tsx';
import { ChatContext, ChatRequestTurn, ChatResponseTurn, ChatResponseMarkdownPart } from 'vscode';

interface IHistoryMessagesProps extends BasePromptElementProps {
	history: ChatContext['history'];
}

export class HistoryMessages extends PromptElement<IHistoryMessagesProps> {
	render(): PromptPiece {
		const history: (UserMessage | AssistantMessage)[] = [];
		for (const turn of this.props.history) {
			if (turn instanceof ChatRequestTurn) {
				history.push(<UserMessage>{turn.prompt}</UserMessage>);
			} else if (turn instanceof ChatResponseTurn) {
				history.push(
					<AssistantMessage name={turn.participant}>
						{chatResponseToMarkdown(turn)}
					</AssistantMessage>
				);
			}
		}
		return (
			<PrioritizedList priority={0} descending={false}>
				{history}
			</PrioritizedList>
		);
	}
}

```

### [Step 2: Define the Prompt component](https://code.visualstudio.com/api/extension-guides/ai/prompt-tsx\#step-2-define-the-prompt-component)

Next, define a `MyPrompt` component that includes the base instructions, user query, and history messages with their appropriate priorities. Priority values are local among siblings. Remember that you might want to trim older messages in the history before touching anything else in the prompt, so you need to split up two `<HistoryMessages>` elements:

Tsx

```
import {
	UserMessage,
	PromptElement,
	BasePromptElementProps,
} from '@vscode/prompt-tsx';

interface IMyPromptProps extends BasePromptElementProps {
	history: ChatContext['history'];
	userQuery: string;
}

export class MyPrompt extends PromptElement<IMyPromptProps> {
	render() {
		return (
			<>
				<UserMessage priority={100}>
					Here are your base instructions. They have the highest priority because you want to make
					sure they're always included!
				</UserMessage>
				{/* Older messages in the history have the lowest priority since they're less relevant */}
				<HistoryMessages history={this.props.history.slice(0, -2)} priority={0} />
				{/* The last 2 history messages are preferred over any workspace context you have below */}
				<HistoryMessages history={this.props.history.slice(-2)} priority={80} />
				{/* The user query is right behind the based instructions in priority */}
				<UserMessage priority={90}>{this.props.userQuery}</UserMessage>
				<UserMessage priority={70}>
					With a slightly lower priority, you can include some contextual data about the workspace
					or files here...
				</UserMessage>
			</>
		);
	}
}

```

Now, all older history messages are pruned before the library tries to prune other elements of the prompt.

### [Step 3: Define the History component](https://code.visualstudio.com/api/extension-guides/ai/prompt-tsx\#step-3-define-the-history-component)

To make consumption a little easier, define a `History` component that wraps the history messages and uses the `passPriority` attribute to act as a pass-through container. With `passPriority`, its children are treated as if they are direct children of the containing element for prioritization purposes.

Tsx

```
import { PromptElement, BasePromptElementProps } from '@vscode/prompt-tsx';

interface IHistoryProps extends BasePromptElementProps {
	history: ChatContext['history'];
	newer: number; // last 2 message priority values
	older: number; // previous message priority values
	passPriority: true; // require this prop be set!
}

export class History extends PromptElement<IHistoryProps> {
	render(): PromptPiece {
		return (
			<>
				<HistoryMessages history={this.props.history.slice(0, -2)} priority={this.props.older} />
				<HistoryMessages history={this.props.history.slice(-2)} priority={this.props.newer} />
			</>
		);
	}
}

```

Now, you can use and reuse this single element to include chat history:

Tsx

```
<History history={this.props.history} passPriority older={0} newer={80}/>

```

## [Grow file contents to fit](https://code.visualstudio.com/api/extension-guides/ai/prompt-tsx\#grow-file-contents-to-fit)

In this example, you want to include the contents of all files the user is currently looking at in their prompt. These files could be large, to the point where including all of them would lead to their text being pruned! This example shows how to use the `flexGrow` property to cooperatively size the file contents to fit within the token budget.

### [Step 1: Define base instructions and user query](https://code.visualstudio.com/api/extension-guides/ai/prompt-tsx\#step-1-define-base-instructions-and-user-query)

First, you define a `UserMessage` component that includes the base instructions.

Tsx

```
<UserMessage priority={100}>Here are your base instructions.</UserMessage>

```

You then include the user query by using the `UserMessage` component. This component has a high priority to ensure it is included right after the base instructions.

Tsx

```
<UserMessage priority={90}>{this.props.userQuery}</UserMessage>

```

### [Step 2: Include the File Contents](https://code.visualstudio.com/api/extension-guides/ai/prompt-tsx\#step-2-include-the-file-contents)

You can now include the file contents by using the `FileContext` component. You assign it a [`flexGrow`](https://github.com/microsoft/vscode-prompt-tsx?tab=readme-ov-file#flex-behavior) value of `1` to ensure it is rendered after the base instructions, user query, and history.

Tsx

```
<FileContext priority={70} flexGrow={1} files={this.props.files} />

```

With a `flexGrow` value, the element gets any _unused_ token budget in its `PromptSizing` object that's passed into its `render()` and `prepare()` calls. You can read more about the behavior of flex elements in the [prompt-tsx documentation](https://github.com/microsoft/vscode-prompt-tsx?tab=readme-ov-file#flex-behavior).

### [Step 3: Include the history](https://code.visualstudio.com/api/extension-guides/ai/prompt-tsx\#step-3-include-the-history)

Next, include the history messages using the `History` component that you created previously. This is a little trickier, since you do want some history to be shown, but also want the file contents to take up most the prompt.

Therefore, assign the `History` component a `flexGrow` value of `2` to ensure it is rendered after all other elements, including `<FileContext />`. But, also set a `flexReserve` value of `"/5"` to reserve 1/5th of the total budget for history.

Tsx

```
<History
	history={this.props.history}
	passPriority
	older={0}
	newer={80}
	flexGrow={2}
	flexReserve="/5"
/>

```

### [Step 3: Combine all elements of the prompt](https://code.visualstudio.com/api/extension-guides/ai/prompt-tsx\#step-3-combine-all-elements-of-the-prompt)

Now, combine all the elements into the `MyPrompt` component.

Tsx

```
import {
	UserMessage,
	PromptElement,
	BasePromptElementProps,
} from '@vscode/prompt-tsx';
import { History } from './history';

interface IFilesToInclude {
	document: TextDocument;
	line: number;
}

interface IMyPromptProps extends BasePromptElementProps {
	history: ChatContext['history'];
	userQuery: string;
	files: IFilesToInclude[];
}

export class MyPrompt extends PromptElement<IMyPromptProps> {
	render() {
		return (
			<>
				<UserMessage priority={100}>Here are your base instructions.</UserMessage>
				<History
					history={this.props.history}
					passPriority
					older={0}
					newer={80}
					flexGrow={2}
					flexReserve="/5"
				/>
				<UserMessage priority={90}>{this.props.userQuery}</UserMessage>
				<FileContext priority={70} flexGrow={1} files={this.props.files} />
			</>
		);
	}
}

```

### [Step 4: Define the FileContext component](https://code.visualstudio.com/api/extension-guides/ai/prompt-tsx\#step-4-define-the-filecontext-component)

Finally, define a `FileContext` component that includes the contents of the files the user is currently looking at. Because you used `flexGrow`, you can implement logic that gets as many of the lines around the 'interesting' line for each file by using the information in `PromptSizing`.

For brevity, the implementation logic for `getExpandedFiles` is omitted. You can check it out in the [prompt-tsx repo](https://github.com/microsoft/vscode-prompt-tsx/blob/5501d54a5b9a7608582e8419cd968a82ca317cc9/examples/file-contents.tsx#L103).

Tsx

```
import { PromptElement, BasePromptElementProps, PromptSizing, PromptPiece } from '@vscode/prompt-tsx';

class FileContext extends PromptElement<{ files: IFilesToInclude[] } & BasePromptElementProps> {
	async render(_state: void, sizing: PromptSizing): Promise<PromptPiece> {
		const files = await this.getExpandedFiles(sizing);
		return <>{files.map(f => f.toString())}</>;
	}

	private async getExpandedFiles(sizing: PromptSizing) {
		// Implementation details are summarized here.
		// Refer to the repo for the complete implementation.
	}
}

```

## [Summary](https://code.visualstudio.com/api/extension-guides/ai/prompt-tsx\#summary)

In these examples, you created a `MyPrompt` component that includes base instructions, user query, history messages, and file contents with different priorities. You used `flexGrow` to cooperatively size the file contents to fit within the token budget.

By following this pattern, you can ensure that the most important parts of your prompt are always included, while less important parts are pruned as needed to fit within the model's context window. For the complete implementation details of the `getExpandedFiles` method and the `FileContextTracker` class, refer to the [prompt-tsx repo](https://github.com/microsoft/vscode-prompt-tsx/tree/main/examples).

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)