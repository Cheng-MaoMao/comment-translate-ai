Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/extension-guides/scm-provider.md "Edit this document in vscode.dev")

# Source Control API

The Source Control API allows extension authors to define Source Control Management (SCM) features. There is a slim, yet powerful API surface which allows many different SCM systems to be integrated in Visual Studio Code, while having a common user interface with all of them.

![VS Code SCM](https://code.visualstudio.com/assets/api/extension-guides/scm-provider/main.png)

VS Code itself ships with one Source Control provider, the Git extension, which is the best reference for this API and is [a great starting point](https://github.com/microsoft/vscode/blob/main/extensions/git/src/repository.ts) if you'd like to contribute your very own SCM provider. There are other great examples in the Marketplace such as the [SVN extension](https://marketplace.visualstudio.com/items?itemName=johnstoncode.svn-scm).

This documentation will help you build an extension which can make any SCM system work with VS Code.

> **Note:** that you can always refer to the [`vscode` namespace API reference](https://code.visualstudio.com/api/references/vscode-api#scm) in our documentation.

## [Source Control Model](https://code.visualstudio.com/api/extension-guides/scm-provider\#source-control-model)

A `SourceControl` is the entity responsible for populating the Source Control model with **resource states**, instances of `SourceControlResourceState`. Resource states are themselves organized in **groups**, instances of `SourceControlResourceGroup`.

You can create a new SourceControl with `vscode.scm.createSourceControl`.

In order to better understand how these three entities correlate with each other, let's take [Git](https://github.com/microsoft/vscode/tree/main/extensions/git) as an example. Consider the following output of `git status`:

Bash

```
vsce main* → git status
On branch main
Your branch is up-to-date with 'origin/main'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        modified:   README.md
        renamed:    src/api.ts -> src/test/api.ts

Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        deleted:    .travis.yml
        modified:   README.md

```

There are many things going on in this workspace. First, the `README.md` file has been modified, staged and then modified once again. Second, the `src/api.ts` file has been moved to `src/test/api.ts` and that move was staged. Finally, the `.travis.yml` file has been deleted.

For this workspace, Git defines two resource groups: the **working tree** and the **index**. Each **file change** within that group is **resource state**:

- **Index** \- resource group

  - `README.md`, modified - resource state
  - `src/test/api.ts`, renamed from `src/api.ts` \- resource state
- **Working Tree** \- resource group

  - `.travis.yml`, deleted - resource state
  - `README.md`, modified - resource state

Note how the same file, `README.md`, is part of two distinct resource states.

Here's how Git creates this model:

TypeScript

```
function createResourceUri(relativePath: string): vscode.Uri {
  const absolutePath = path.join(vscode.workspace.rootPath, relativePath);
  return vscode.Uri.file(absolutePath);
}

const gitSCM = vscode.scm.createSourceControl('git', 'Git');

const index = gitSCM.createResourceGroup('index', 'Index');
index.resourceStates = [\
  { resourceUri: createResourceUri('README.md') },\
  { resourceUri: createResourceUri('src/test/api.ts') }\
];

const workingTree = gitSCM.createResourceGroup('workingTree', 'Changes');
workingTree.resourceStates = [\
  { resourceUri: createResourceUri('.travis.yml') },\
  { resourceUri: createResourceUri('README.md') }\
];

```

Changes made to the source control and resource groups will be propagated to the Source Control view.

## [Source Control View](https://code.visualstudio.com/api/extension-guides/scm-provider\#source-control-view)

VS Code is able to populate the Source Control view, as the Source Control model changes. Resource states are customizable using `SourceControlResourceDecorations`:

TypeScript

```
export interface SourceControlResourceState {
  readonly decorations?: SourceControlResourceDecorations;
}

```

The previous example would be sufficient to populate a simple list in the Source Control view, but there are many user interactions that the user might want to perform with each resource. For instance, what happens when the user clicks a resource state? The resource state can optionally provide a command to handle this action:

TypeScript

```
export interface SourceControlResourceState {
  readonly command?: Command;
}

```

### [Menus](https://code.visualstudio.com/api/extension-guides/scm-provider\#menus)

There are six Source Control menu ids where you can place menu items, in order to provide the user with a much richer user interface.

The `scm/title` menu is located to the right of the SCM view title. The menu items in the `navigation` group will be inline, while all the others will be within the `…` dropdown menu.

These three are similar:

- `scm/resourceGroup/context` adds commands to [`SourceControlResourceGroup`](https://code.visualstudio.com/api/references/contribution-points#contributes.menus) items.
- `scm/resourceState/context` adds commands to [`SourceControlResourceState`](https://code.visualstudio.com/api/references/contribution-points#contributes.menus) items.
- `scm/resourceFolder/context` add commands to the intermediate folders that appear when a [`SourceControlResourceState`](https://code.visualstudio.com/api/references/contribution-points#contributes.menus)'s resourceUri path includes folders and the user has opted for tree-view rather than list-view mode.

Place menu items in the `inline` group to have them inline. All other menu item groups will be represented in a context menu usually accessible using the mouse right-click.

Note that the SCM view supports multiple selection, so a command receives as its argument an array of one or more resources.

For example, Git supports staging multiple files by adding the `git.stage` command to the `scm/resourceState/context` menu and using such a method declaration:

TypeScript

```
stage(...resourceStates: SourceControlResourceState[]): Promise<void>;

```

When creating them, `SourceControl` and `SourceControlResourceGroup` instances require you to provide an `id` string. These values will be populated in the `scmProvider` and `scmResourceGroup` context keys, respectively. You can rely on these [context keys](https://code.visualstudio.com/api/references/when-clause-contexts) in the `when` clauses of your menu items. Here's how Git is able to show an inline menu item for its `git.stage` command:

JSON

```
{
  "command": "git.stage",
  "when": "scmProvider == git && scmResourceGroup == merge",
  "group": "inline"
}

```

The `scm/sourceControl` menu is the context menu on each `SourceControl` instance in the **Source Control Repositories** view:

![source control menu](https://code.visualstudio.com/assets/api/extension-guides/scm-provider/sourcecontrol-menu.png)

The `scm/change/title` allows you to contribute commands to the title bar of the [Quick Diff](https://code.visualstudio.com/api/references/vscode-api#QuickDiffProvider) inline diff editor, described [further ahead](https://code.visualstudio.com/api/extension-guides/scm-provider#quick-diff). The command will be passed as arguments the URI of the document, the array of changes within it, and the index of the change which the inline change diff editor is currently focused on. For example, here's the declaration of the `stageChange` Git command which is contributed to this menu with a `when` clause testing that the `originalResourceScheme` [context key](https://code.visualstudio.com/api/references/when-clause-contexts) equals `git`:

TypeScript

```
async stageChange(uri: Uri, changes: LineChange[], index: number): Promise<void>;

```

### [SCM Input Box](https://code.visualstudio.com/api/extension-guides/scm-provider\#scm-input-box)

The Source Control Input Box, located atop of each Source Control view, allows the user to input a message. You can get (and set) this message in order to perform operations. In Git, for example, this is used as the commit box, in which users type in commit messages and `git commit` commands pick them up.

TypeScript

```
export interface SourceControlInputBox {
  value: string;
}

export interface SourceControl {
  readonly inputBox: SourceControlInputBox;
}

```

The user can type `Ctrl+Enter` (or `Cmd+Enter` on macOS) to accept any message. You can handle this event by providing a `acceptInputCommand` to your `SourceControl` instance.

TypeScript

```
export interface SourceControl {
  readonly acceptInputCommand?: Command;
}

```

## [Quick Diff](https://code.visualstudio.com/api/extension-guides/scm-provider\#quick-diff)

VS Code also supports displaying **quick diff** editor gutter decorations. Clicking those decorations will reveal an inline diff experience, to which you can contribute contextual commands:

![SCM quick diff](https://code.visualstudio.com/assets/api/extension-guides/scm-provider/quickdiff.png)

These decorations are computed by VS Code itself. All you need to do is provide VS Code with the original contents of any given file.

TypeScript

```
export interface SourceControl {
  quickDiffProvider?: QuickDiffProvider;
}

```

Using a `QuickDiffProvider`'s `provideOriginalResource` method, your implementation is able to tell VS Code the `Uri` of the original resource that matches the resource whose `Uri` is provided as an argument to the method.

Combine this API with the [`registerTextDocumentContentProvider` method in the `workspace` namespace](https://code.visualstudio.com/api/references/vscode-api#workspace), which lets you provide contents for arbitrary resources, given a [`Uri`](https://code.visualstudio.com/api/references/vscode-api#Uri) matching the custom `scheme` that it registered for.

## [Next steps](https://code.visualstudio.com/api/extension-guides/scm-provider\#next-steps)

To learn more about VS Code extensibility model, try these topics:

- [SCM API Reference](https://code.visualstudio.com/api/references/vscode-api#scm) \- Read the full SCM API documentation
- [Git Extension](https://github.com/microsoft/vscode/tree/main/extensions/git) \- Learn by reading the Git extension implementation
- [Extension API Overview](https://code.visualstudio.com/api) \- Learn about the full VS Code extensibility model.
- [Extension Manifest File](https://code.visualstudio.com/api/references/extension-manifest) \- VS Code package.json extension manifest file reference
- [Contribution Points](https://code.visualstudio.com/api/references/contribution-points) \- VS Code contribution points reference

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)