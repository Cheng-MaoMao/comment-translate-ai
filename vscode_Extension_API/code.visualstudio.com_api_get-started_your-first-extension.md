Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/get-started/your-first-extension.md "Edit this document in vscode.dev")

# Your First Extension

In this topic, we'll teach you the fundamental concepts for building extensions. Make sure you have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed.

First, use [Yeoman](https://yeoman.io/) and [VS Code Extension Generator](https://www.npmjs.com/package/generator-code) to scaffold a TypeScript or JavaScript project ready for development.

- If you do not want to install Yeoman for later use, run the following command:



Bash



```
npx --package yo --package generator-code -- yo code

```

- If you instead want to install Yeoman globally to ease running it repeatedly, run the following command:



Bash



```
npm install --global yo generator-code

yo code

```


For a TypeScript project, fill out the following fields:

Bash

```
# ? What type of extension do you want to create? New Extension (TypeScript)
# ? What's the name of your extension? HelloWorld
### Press <Enter> to choose default for all options below ###

# ? What's the identifier of your extension? helloworld
# ? What's the description of your extension? LEAVE BLANK
# ? Initialize a git repository? Y
# ? Which bundler to use? unbundled
# ? Which package manager to use? npm

# ? Do you want to open the new folder with Visual Studio Code? Open with `code`

```

Inside the editor, open `src/extension.ts` and press F5 or run the command **Debug: Start Debugging** from the Command Palette (Ctrl+Shift+P). This will compile and run the extension in a new **Extension Development Host** window.

Run the **Hello World** command from the Command Palette (Ctrl+Shift+P) in the new window:

You should see the `Hello World from HelloWorld!` notification showing up. Success!

If you aren't able to see the **Hello World** command in the debug window, check the `package.json` file and make sure that `engines.vscode` version is compatible with the installed version of VS Code.

## [Developing the extension](https://code.visualstudio.com/api/get-started/your-first-extension\#developing-the-extension)

Let's make a change to the message:

1. Change the message from "Hello World from HelloWorld!" to "Hello VS Code" in `extension.ts`.
2. Run **Developer: Reload Window** in the new window.
3. Run the command **Hello World** again.

You should see the updated message showing up.

Here are some ideas for things for you to try:

- Give the **Hello World** command a new name in the Command Palette.
- [Contribute](https://code.visualstudio.com/api/references/contribution-points) another command that displays current time in an information message. Contribution points are static declarations you make in the `package.json` [Extension Manifest](https://code.visualstudio.com/api/references/extension-manifest) to extend VS Code, such as adding commands, menus, or keybindings to your extension.
- Replace the `vscode.window.showInformationMessage` with another [VS Code API](https://code.visualstudio.com/api/references/vscode-api) call to show a warning message.

## [Debugging the extension](https://code.visualstudio.com/api/get-started/your-first-extension\#debugging-the-extension)

VS Code's built-in debugging functionality makes it easy to debug extensions. Set a breakpoint by clicking the gutter next to a line, and VS Code will hit the breakpoint. You can hover over variables in the editor or use the **Run and Debug** view in the left to check a variable's value. The Debug Console allows you to evaluate expressions.

You can learn more about debugging Node.js apps in VS Code in the [Node.js Debugging Topic](https://code.visualstudio.com/docs/nodejs/nodejs-debugging).

## [Next steps](https://code.visualstudio.com/api/get-started/your-first-extension\#next-steps)

In the next topic, [Extension Anatomy](https://code.visualstudio.com/api/get-started/extension-anatomy), we'll take a closer look at the source code of the `Hello World` sample and explain key concepts.

You can find the source code of this tutorial at: [https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-sample). The [Extension Guides](https://code.visualstudio.com/api/extension-guides/overview) topic contains other samples, each illustrating a different VS Code API or Contribution Point, and following the recommendations in our [UX Guidelines](https://code.visualstudio.com/api/ux-guidelines/overview).

### [Using JavaScript](https://code.visualstudio.com/api/get-started/your-first-extension\#using-javascript)

In this guide, we mainly describe how to develop VS Code extension with TypeScript because we believe TypeScript offers the best experience for developing VS Code extensions. However, if you prefer JavaScript, you can still follow along using [helloworld-minimal-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-minimal-sample).

### [UX Guidelines](https://code.visualstudio.com/api/get-started/your-first-extension\#ux-guidelines)

This is also a good time to review our [UX Guidelines](https://code.visualstudio.com/api/ux-guidelines/overview) so you can start designing your extension user interface to follow the VS Code best practices.

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)