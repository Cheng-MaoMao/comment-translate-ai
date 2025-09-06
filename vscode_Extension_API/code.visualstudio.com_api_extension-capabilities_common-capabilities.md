Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/extension-capabilities/common-capabilities.md "Edit this document in vscode.dev")

# Common Capabilities

Common Capabilities are important building blocks for your extensions. Almost all extensions use some of these functionalities. Here is how you can take advantage of them.

## [Command](https://code.visualstudio.com/api/extension-capabilities/common-capabilities\#command)

Command is central to how VS Code works. You open the Command Palette to execute commands, bind custom keybindings to commands, and right-click to invoke commands in Context Menus.

An extension could:

- Register and execute commands with the [`vscode.commands`](https://code.visualstudio.com/api/references/vscode-api#commands) API.
- Make commands available in the Command Palette with the [`contributes.commands`](https://code.visualstudio.com/api/references/contribution-points#contributes.commands) Contribution Point.

Learn more about commands at the [Extension Guides / Command](https://code.visualstudio.com/api/extension-guides/command) topic.

## [Configuration](https://code.visualstudio.com/api/extension-capabilities/common-capabilities\#configuration)

An extension can contribute extension-specific settings with the [`contributes.configuration`](https://code.visualstudio.com/api/references/contribution-points#contributes.configuration) Contribution Point and read them using the [`workspace.getConfiguration`](https://code.visualstudio.com/api/references/vscode-api#workspace.getConfiguration) API.

## [Keybinding](https://code.visualstudio.com/api/extension-capabilities/common-capabilities\#keybinding)

An extension can add custom keybindings. Read more in the [`contributes.keybindings`](https://code.visualstudio.com/api/references/contribution-points#contributes.keybindings) and [Key Bindings](https://code.visualstudio.com/docs/getstarted/keybindings) topics.

## [Context Menu](https://code.visualstudio.com/api/extension-capabilities/common-capabilities\#context-menu)

An extension can register custom Context Menu items that will be displayed in different parts of the VS Code UI on right-click. Read more at the [`contributes.menus`](https://code.visualstudio.com/api/references/contribution-points#contributes.menus) Contribution Point.

## [Data Storage](https://code.visualstudio.com/api/extension-capabilities/common-capabilities\#data-storage)

There are five options for storing data:

- [`ExtensionContext.workspaceState`](https://code.visualstudio.com/api/references/vscode-api#ExtensionContext.workspaceState): A workspace storage where you can write key/value pairs. VS Code manages the storage and will restore it when the same workspace is opened again.
- [`ExtensionContext.globalState`](https://code.visualstudio.com/api/references/vscode-api#ExtensionContext.globalState): A global storage where you can write key/value pairs. VS Code manages the storage and will restore it for each extension activation. You can selectively synchronize key/value pairs in global storage by setting the keys for sync using `setKeysForSync` method on `globalState`.
- [`ExtensionContext.storageUri`](https://code.visualstudio.com/api/references/vscode-api#ExtensionContext.storageUri): A workspace specific storage URI pointing to a local directory where your extension has read/write access. This is a good option if you need to store large files that are accessible only from the current workspace.
- [`ExtensionContext.globalStorageUri`](https://code.visualstudio.com/api/references/vscode-api#ExtensionContext.globalStorageUri): A global storage URI pointing to a local directory where your extension has read/write access. This is a good option if you need to store large files that are accessible from all workspaces.
- [`ExtensionContext.secrets`](https://code.visualstudio.com/api/references/vscode-api#ExtensionContext.secrets): A global storage for secrets (or any information that is sensitive) that will be encrypted. These are not synced across machines. For VS Code desktop, this leverages Electron's [safeStorage API](https://www.electronjs.org/docs/latest/api/safe-storage). For VS Code for the Web, this uses a Double Key Encryption (DKE) implementation.

The extension context is available to the `activate` function in the [Extension Entry File](https://code.visualstudio.com/api/get-started/extension-anatomy#extension-entry-file).

### [setKeysForSync example](https://code.visualstudio.com/api/extension-capabilities/common-capabilities\#setkeysforsync-example)

If your extension needs to preserve some user state across different machines then provide the state to [Setting Sync](https://code.visualstudio.com/docs/configure/settings-sync) using `vscode.ExtensionContext.globalState.setKeysForSync`.

You can use the following pattern:

TypeScript

```
// on activate
const versionKey = 'shown.version';
context.globalState.setKeysForSync([versionKey]);

// later on show page
const currentVersion = context.extension.packageJSON.version;
const lastVersionShown = context.globalState.get(versionKey);
if (isHigher(currentVersion, lastVersionShown)) {
    context.globalState.update(versionKey, currentVersion);
}

```

Sharing state across machines can help avoid the problem of users seeing multiple instances of a welcome or update page, by sharing dismissed or viewed flags.

## [Display Notifications](https://code.visualstudio.com/api/extension-capabilities/common-capabilities\#display-notifications)

Almost all extensions need to present information to the user at some point. VS Code offers three APIs for displaying notification messages of different severity:

- [`window.showInformationMessage`](https://code.visualstudio.com/api/references/vscode-api#window.showInformationMessage)
- [`window.showWarningMessage`](https://code.visualstudio.com/api/references/vscode-api#window.showWarningMessage)
- [`window.showErrorMessage`](https://code.visualstudio.com/api/references/vscode-api#window.showErrorMessage)

## [Quick Pick](https://code.visualstudio.com/api/extension-capabilities/common-capabilities\#quick-pick)

With the [`vscode.QuickPick`](https://code.visualstudio.com/api/references/vscode-api#QuickPick) API, you can easily collect user input or let the user make a selection from multiple options. The [QuickInput sample](https://github.com/microsoft/vscode-extension-samples/tree/main/quickinput-sample) illustrates the API.

## [File Picker](https://code.visualstudio.com/api/extension-capabilities/common-capabilities\#file-picker)

Extensions can use the [`window.showOpenDialog`](https://code.visualstudio.com/api/references/vscode-api#window.showOpenDialog) API to open the system file picker and select files or folders.

## [Output Channel](https://code.visualstudio.com/api/extension-capabilities/common-capabilities\#output-channel)

The Output Panel displays a collection of [`OutputChannel`](https://code.visualstudio.com/api/references/vscode-api#OutputChannel), which are great for logging purpose. You can easily take advantage of it with the [`window.createOutputChannel`](https://code.visualstudio.com/api/references/vscode-api#window.createOutputChannel) API.

## [Progress API](https://code.visualstudio.com/api/extension-capabilities/common-capabilities\#progress-api)

You can use the [`vscode.Progress`](https://code.visualstudio.com/api/references/vscode-api#Progress) API for reporting progress updates to the user.

Progress can be shown in different locations using the [`ProgressLocation`](https://code.visualstudio.com/api/references/vscode-api#ProgressLocation) option:

- In the Notifications area
- In the Source Control view
- General progress in the VS Code window

The [Progress sample](https://github.com/microsoft/vscode-extension-samples/tree/main/progress-sample) illustrates this API.

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)