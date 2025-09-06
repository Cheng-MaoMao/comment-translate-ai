Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/get-started/extension-anatomy.md "Edit this document in vscode.dev")

# Extension Anatomy

In the last topic, you were able to get a basic extension running. How does it work under the hood?

The `Hello World` extension does 3 things:

- Registers the [`onCommand`](https://code.visualstudio.com/api/references/activation-events#onCommand) [**Activation Event**](https://code.visualstudio.com/api/references/activation-events): `onCommand:helloworld.helloWorld`, so the extension becomes activated when user runs the `Hello World` command.

> **Note:** Starting with [VS Code 1.74.0](https://code.visualstudio.com/updates/v1_74#_implicit-activation-events-for-declared-extension-contributions), commands declared in the `commands` section of `package.json` automatically activate the extension when invoked, without requiring an explicit `onCommand` entry in `activationEvents`.

- Uses the [`contributes.commands`](https://code.visualstudio.com/api/references/contribution-points#contributes.commands) [**Contribution Point**](https://code.visualstudio.com/api/references/contribution-points) to make the command `Hello World` available in the Command Palette, and bind it to a command ID `helloworld.helloWorld`.
- Uses the [`commands.registerCommand`](https://code.visualstudio.com/api/references/vscode-api#commands.registerCommand) [**VS Code API**](https://code.visualstudio.com/api/references/vscode-api) to bind a function to the registered command ID `helloworld.helloWorld`.

Understanding these three concepts is crucial to writing extensions in VS Code:

- [**Activation Events**](https://code.visualstudio.com/api/references/activation-events): events upon which your extension becomes active.
- [**Contribution Points**](https://code.visualstudio.com/api/references/contribution-points): static declarations that you make in the `package.json` [Extension Manifest](https://code.visualstudio.com/api/get-started/extension-anatomy#extension-manifest) to extend VS Code.
- [**VS Code API**](https://code.visualstudio.com/api/references/vscode-api): a set of JavaScript APIs that you can invoke in your extension code.

In general, your extension would use a combination of Contribution Points and VS Code API to extend VS Code's functionality. The [Extension Capabilities Overview](https://code.visualstudio.com/api/extension-capabilities/overview) topic helps you find the right Contribution Point and VS Code API for your extension.

Let's take a closer look at `Hello World` sample's source code and see how these concepts apply to it.

## [Extension File Structure](https://code.visualstudio.com/api/get-started/extension-anatomy\#extension-file-structure)

Text

```
.
├── .vscode
│   ├── launch.json     // Config for launching and debugging the extension
│   └── tasks.json      // Config for build task that compiles TypeScript
├── .gitignore          // Ignore build output and node_modules
├── README.md           // Readable description of your extension's functionality
├── src
│   └── extension.ts    // Extension source code
├── package.json        // Extension manifest
├── tsconfig.json       // TypeScript configuration

```

You can read more about the configuration files:

- `launch.json` used to configure VS Code [Debugging](https://code.visualstudio.com/docs/debugtest/debugging)
- `tasks.json` for defining VS Code [Tasks](https://code.visualstudio.com/docs/debugtest/tasks)
- `tsconfig.json` consult the TypeScript [Handbook](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

However, let's focus on `package.json` and `extension.ts`, which are essential to understanding the `Hello World` extension.

### [Extension Manifest](https://code.visualstudio.com/api/get-started/extension-anatomy\#extension-manifest)

Each VS Code extension must have a `package.json` as its [Extension Manifest](https://code.visualstudio.com/api/references/extension-manifest). The `package.json` contains a mix of Node.js fields such as `scripts` and `devDependencies` and VS Code specific fields such as `publisher`, `activationEvents` and `contributes`. You can find descriptions of all VS Code specific fields in [Extension Manifest Reference](https://code.visualstudio.com/api/references/extension-manifest). Here are some most important fields:

- `name` and `publisher`: VS Code uses `<publisher>.<name>` as a unique ID for the extension. For example, the Hello World sample has the ID `vscode-samples.helloworld-sample`. VS Code uses the ID to uniquely identify your extension.
- `main`: The extension entry point.
- `activationEvents` and `contributes`: [Activation Events](https://code.visualstudio.com/api/references/activation-events) and [Contribution Points](https://code.visualstudio.com/api/references/contribution-points).
- `engines.vscode`: This specifies the minimum version of VS Code API that the extension depends on.

JSON

```
{
  "name": "helloworld-sample",
  "displayName": "helloworld-sample",
  "description": "HelloWorld example for VS Code",
  "version": "0.0.1",
  "publisher": "vscode-samples",
  "repository": "https://github.com/microsoft/vscode-extension-samples/helloworld-sample",
  "engines": {
    "vscode": "^1.51.0"
  },
  "categories": ["Other"],
  "activationEvents": [],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [\
      {\
        "command": "helloworld.helloWorld",\
        "title": "Hello World"\
      }\
    ]
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./"
  },
  "devDependencies": {
    "@types/node": "^8.10.25",
    "@types/vscode": "^1.51.0",
    "tslint": "^5.16.0",
    "typescript": "^3.4.5"
  }
}

```

> **Note**: If your extension targets a VS Code version prior to 1.74, you must explicitly list `onCommand:helloworld.helloWorld` in `activationEvents`.

## [Extension Entry File](https://code.visualstudio.com/api/get-started/extension-anatomy\#extension-entry-file)

The extension entry file exports two functions, `activate` and `deactivate`. `activate` is executed when your registered **Activation Event** happens. `deactivate` gives you a chance to clean up before your extension becomes deactivated. For many extensions, explicit cleanup may not be required, and the `deactivate` method can be removed. However, if an extension needs to perform an operation when VS Code is shutting down or the extension is disabled or uninstalled, this is the method to do so.

The VS Code extension API is declared in the [@types/vscode](https://www.npmjs.com/package/@types/vscode) type definitions. The version of the `vscode` type definitions is controlled by the value in the `engines.vscode` field in `package.json`. The `vscode` types give you IntelliSense, Go to Definition, and other TypeScript language features in your code.

TypeScript

```
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "helloworld-sample" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage('Hello World!');
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

```

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)