Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/extension-guides/ai/language-model-chat-provider.md "Edit this document in vscode.dev")

# Language Model Chat Provider API

The Language Model Chat Provider API enables you to contribute your own language models to chat in Visual Studio Code.

## [Overview](https://code.visualstudio.com/api/extension-guides/ai/language-model-chat-provider\#overview)

The `LanguageModelChatProvider` interface follows a one-provider-to-many-models relationship, enabling providers to offer multiple models. Each provider is responsible for:

- Discovering and preparing available language models
- Handling chat requests for its models
- Providing token counting functionality

## [Language model information](https://code.visualstudio.com/api/extension-guides/ai/language-model-chat-provider\#language-model-information)

Each language model must provide metadata through the `LanguageModelChatInformation` interface. The `prepareLanguageModelChatInformation` method returns an array of these objects to inform VS Code about the available models.

TypeScript

```
interface LanguageModelChatInformation {
  readonly id: string; // Unique identifier for the model - unique within the provider
  readonly name: string; // Human-readable name of the language model - shown in the model picker
  readonly family: string; // Model family name
  readonly version: string; // Version string
  readonly maxInputTokens: number; // Maximum number of tokens the model can accept as input
  readonly maxOutputTokens: number; // Maximum number of tokens the model is capable of producing
  readonly tooltip?: string; // Optional tooltip text when hovering the model in the UI
  readonly detail?: string; // Human-readable text that is rendered alongside the model
  readonly capabilities: {
    readonly imageInput?: boolean; // Supports image inputs
    readonly toolCalling?: boolean | number; // Supports tool calling
  };
}

```

## [Register the provider](https://code.visualstudio.com/api/extension-guides/ai/language-model-chat-provider\#register-the-provider)

1. The first step is to register the provider in your `package.json`, in the `contributes.languageModelChatProviders` section. Provide a unique `vendor` ID and a `displayName`.



JSON



```
{
     "contributes": {
       "languageModelChatProviders": [\
         {\
           "vendor": "my-provider",\
           "displayName": "My Provider"\
         }\
       ]
     }
}

```

2. Next, in your extension activation function, register your language model provider using the `lm.registerLanguageModelChatProvider` method.

Provide the provider ID that you used in the `package.json` and an instance of your provider class:



TypeScript



```
import * as vscode from 'vscode';
import { SampleChatModelProvider } from './provider';

export function activate(_: vscode.ExtensionContext) {
     vscode.lm.registerLanguageModelChatProvider('my-provider', new SampleChatModelProvider());
}

```

3. Optionally, provide a `contributes.languageModelChatProviders.managementCommand` in your `package.json` to allow users to manage the language model provider.

The value of the `managementCommand` property must be a command defined in the `contributes.commands` section of your `package.json`. In your extension, register the command ( `vscode.commands.registerCommand`) and implement the logic for managing the provider such as configuring API keys or other settings.



JSON



```
{
     "contributes": {
       "languageModelChatProviders": [\
         {\
           "vendor": "my-provider",\
           "displayName": "My Provider",\
           "managementCommand": "my-provider.manage"\
         }\
       ],
       "commands": [\
         {\
           "command": "my-provider.manage",\
           "title": "Manage My Provider"\
         }\
       ]
     }
}

```


## [Implement the provider](https://code.visualstudio.com/api/extension-guides/ai/language-model-chat-provider\#implement-the-provider)

A language provider must implement the `LanguageModelChatProvider` interface, which has three main methods:

- `prepareLanguageModelChatInformation`: returns the list of available models
- `provideLanguageModelChatResponse`: handles chat requests and streams responses
- `provideTokenCount`: implements token counting functionality

### [Prepare language model information](https://code.visualstudio.com/api/extension-guides/ai/language-model-chat-provider\#prepare-language-model-information)

The `prepareLanguageModelChatInformation` method is called by VS Code to discover the available models and returns a list of `LanguageModelChatInformation` objects.

Use the `options.silent` parameter to control whether to prompt the user for credentials or extra configuration:

TypeScript

```
async prepareLanguageModelChatInformation(
    options: { silent: boolean },
    token: CancellationToken
): Promise<LanguageModelChatInformation[]> {
    if (options.silent) {
        return []; // Don't prompt user in silent mode
    } else {
        await this.promptForApiKey(); // Prompt user for credentials
    }

    // Fetch available models from your service
    const models = await this.fetchAvailableModels();

    // Map your models to LanguageModelChatInformation format
    return models.map(model => ({
        id: model.id,
        name: model.displayName,
        family: model.family,
        version: '1.0.0',
        maxInputTokens: model.contextWindow - model.maxOutput,
        maxOutputTokens: model.maxOutput,
        capabilities: {
            imageInput: model.supportsImages,
            toolCalling: model.supportsTools
        },
        requiresAuthorization: true
    }));
}

```

### [Handle chat requests](https://code.visualstudio.com/api/extension-guides/ai/language-model-chat-provider\#handle-chat-requests)

The `provideLanguageModelChatResponse` method handles actual chat requests. The provider receives an array of messages in the `LanguageModelChatRequestMessage` format and you can optionally convert them to the format required by your language model API (see [Message format and conversion](https://code.visualstudio.com/api/extension-guides/ai/language-model-chat-provider#message-format-and-conversion)).

Use the `progress` parameter to stream response chunks. The response can include text parts, tool calls, and tool results (see [Response parts](https://code.visualstudio.com/api/extension-guides/ai/language-model-chat-provider#response-parts)).

TypeScript

```
async provideLanguageModelChatResponse(
    model: LanguageModelChatInformation,
    messages: readonly LanguageModelChatRequestMessage[],
    options: LanguageModelChatRequestHandleOptions,
    progress: Progress<LanguageModelResponsePart>,
    token: CancellationToken
): Promise<void> {

    // TODO: Implement message conversion, processing, and response streaming

    // Optionally, differentiate behavior based on model ID
    if (model.id === "my-model-a") {
        progress.report(new LanguageModelTextPart("This is my A response."));
    } else {
        progress.report(new LanguageModelTextPart("Unknown model."));
    }
}

```

### [Provide token count](https://code.visualstudio.com/api/extension-guides/ai/language-model-chat-provider\#provide-token-count)

The `provideTokenCount` method is responsible for estimating the number of tokens in a given text input:

TypeScript

```
async provideTokenCount(
    model: LanguageModelChatInformation,
    text: string | LanguageModelChatRequestMessage,
    token: CancellationToken
): Promise<number> {
    // TODO: Implement token counting for your models

    // Example estimation for strings
    return Math.ceil(text.toString().length / 4);
}

```

## [Message format and conversion](https://code.visualstudio.com/api/extension-guides/ai/language-model-chat-provider\#message-format-and-conversion)

Your provider receives messages in the `LanguageModelChatRequestMessage` format, which you'll typically need to convert to your service's API format. The message content can be a mix of text parts, tool calls, and tool results.

TypeScript

```
interface LanguageModelChatRequestMessage {
  readonly role: LanguageModelChatMessageRole;
  readonly content: ReadonlyArray<LanguageModelInputPart | unknown>;
  readonly name: string | undefined;
}

```

Optionally, convert these messages appropriately for your language model API:

TypeScript

```
private convertMessages(messages: readonly LanguageModelChatRequestMessage[]) {
    return messages.map(msg => ({
        role: msg.role === vscode.LanguageModelChatMessageRole.User ? 'user' : 'assistant',
        content: msg.content
            .filter(part => part instanceof vscode.LanguageModelTextPart)
            .map(part => (part as vscode.LanguageModelTextPart).value)
            .join('')
    }));
}

```

## [Response parts](https://code.visualstudio.com/api/extension-guides/ai/language-model-chat-provider\#response-parts)

Your provider can report different types of response parts through the progress callback via the `LanguageModelResponsePart` type, which can be one of:

- `LanguageModelTextPart` \- Text content
- `LanguageModelToolCallPart` \- Tool/function calls
- `LanguageModelToolResultPart` \- Tool result content

## [Getting started](https://code.visualstudio.com/api/extension-guides/ai/language-model-chat-provider\#getting-started)

You can get started with a [basic example project](https://github.com/microsoft/vscode-extension-samples/blob/main/chat-model-provider-sample).

## [Related content](https://code.visualstudio.com/api/extension-guides/ai/language-model-chat-provider\#related-content)

- [VS Code API Reference](https://code.visualstudio.com/api/references/vscode-api)
- [Language Model API Guide](https://code.visualstudio.com/api/extension-guides/ai/language-model)
- [Chat API Extension](https://code.visualstudio.com/api/extension-guides/ai/chat)

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)