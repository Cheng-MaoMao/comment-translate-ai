Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/extension-capabilities/overview.md "Edit this document in vscode.dev")

# Extension Capabilities Overview

Visual Studio Code offers many ways for extensions to extend its capabilities. It can sometimes be hard to find the right [Contribution Points](https://code.visualstudio.com/api/references/contribution-points) and [VS Code API](https://code.visualstudio.com/api/references/vscode-api) to use. This topic splits extension capabilities into a few categories. Each category describes:

- Some functionalities your extension could use
- Links to more detailed topics for using these functionalities
- A few extension ideas

However, we also impose [restrictions](https://code.visualstudio.com/api/extension-capabilities/overview#restrictions) upon extensions to ensure the stability and performance of VS Code. For example, extensions cannot access the DOM of VS Code UI.

## [Common Capabilities](https://code.visualstudio.com/api/extension-capabilities/overview\#common-capabilities)

[Common Capabilities](https://code.visualstudio.com/api/extension-capabilities/common-capabilities) are core pieces of functionality that you can use in any extension.

Some of these capabilities include:

- Registering commands, configurations, keybindings, or context menu items.
- Storing workspace or global data.
- Displaying notification messages.
- Using Quick Pick to collect user input.
- Open the system file picker to let users select files or folders.
- Use the Progress API to indicate long-running operations.

## [Theming](https://code.visualstudio.com/api/extension-capabilities/overview\#theming)

[Theming](https://code.visualstudio.com/api/extension-capabilities/theming) controls the look of VS Code, both the colors of source code in the editor and the colors of the VS Code UI. If you've ever wanted to make it look like you're coding the Matrix by making VS Code different shades of green, or just wanted to create the ultimate, minimalist grayscale workspace, then themes are for you.

**Extension Ideas**

- Change colors of your source code.
- Change colors of the VS Code UI.
- Port an existing TextMate theme to VS Code.
- Add custom file icons.

## [Declarative Language Features](https://code.visualstudio.com/api/extension-capabilities/overview\#declarative-language-features)

[Declarative Language Features](https://code.visualstudio.com/api/language-extensions/overview#declarative-language-features) adds basic text editing support for a programming language such as bracket matching, auto-indentation and syntax highlighting. This is done declaratively, without writing any code. For more advanced language features, like IntelliSense or debugging, see [Programmatic Language Features](https://code.visualstudio.com/api/extension-capabilities/overview#programmatic-language-features).

**Extension Ideas**

- Bundle common JavaScript snippets into an extension.
- Tell VS Code about a new programming language.
- Add or replace the grammar for a programming language.
- Extend an existing grammar with grammar injections.
- Port an existing TextMate grammar to VS Code.

## [Programmatic Language Features](https://code.visualstudio.com/api/extension-capabilities/overview\#programmatic-language-features)

[Programmatic Language Features](https://code.visualstudio.com/api/language-extensions/overview#programmatic-language-features) add rich programming language support such as Hovers, Go to Definition, diagnostic errors, IntelliSense and CodeLens. These language features are exposed through the [`vscode.languages.*`](https://code.visualstudio.com/api/references/vscode-api#languages) API. An extension can either use these APIs directly, or write a Language Server and adapt it to VS Code using the VS Code [Language Server library](https://github.com/microsoft/vscode-languageserver-node).

Although we provide a listing of [language features](https://code.visualstudio.com/api/language-extensions/programmatic-language-features) and their intended usage, nothing prevents you from using these API creatively. For example, CodeLens and Hovers are a great way to present additional information inline, while diagnostic errors can be used to highlight spelling or code style errors.

**Extension Ideas**

- Add hovers that show sample usage of an API.
- Report spelling or linter errors in source code using diagnostics.
- Register a new code formatter for HTML.
- Provide rich, context-aware IntelliSense.
- Add folding, breadcrumbs and outline support for a language.

## [Workbench Extensions](https://code.visualstudio.com/api/extension-capabilities/overview\#workbench-extensions)

[Workbench Extensions](https://code.visualstudio.com/api/extension-capabilities/extending-workbench) extend the VS Code Workbench UI. Add new right-click actions to the File Explorer, or even build a custom explorer using VS Code's [TreeView](https://code.visualstudio.com/api/extension-guides/tree-view) API. And if your extension needs a fully customized user interface, use the [Webview API](https://code.visualstudio.com/api/extension-guides/webview) to build your own document preview or UI using standard HTML, CSS, and JavaScript.

**Extension Ideas**

- Add custom context menu actions to the File Explorer.
- Create a new, interactive TreeView in the Side Bar.
- Define a new Activity Bar view.
- Show new information in the Status Bar.
- Render custom content using the `WebView` API.
- Contribute Source Control providers.

## [Debugging](https://code.visualstudio.com/api/extension-capabilities/overview\#debugging)

You can take advantage of VS Code's [Debugging](https://code.visualstudio.com/docs/debugtest/debugging) functionality by writing [Debugger Extensions](https://code.visualstudio.com/api/extension-guides/debugger-extension) that connect VS Code's debugging UI to a specific debugger or runtime.

**Extension Ideas**

- Connect VS Code's debugging UI to a debugger or runtime by contributing a [Debug Adapter implementation](https://microsoft.github.io/debug-adapter-protocol/implementors/adapters/).
- Specify the languages supported by a debugger extension.
- Provide rich IntelliSense and hover information for the debug configuration attributes used by the debugger.
- Provide debug configuration snippets.

On the other hand, VS Code also offers a set of [Debug Extension API](https://code.visualstudio.com/api/references/vscode-api#debug), with which you can implement debug-related functionality on top of any VS Code debugger, in order to automate users' debugging experience.

**Extension Ideas**

- Start debug sessions based on dynamically created debug configurations.
- Track the lifecycle of debug sessions.
- Create and manage breakpoints programmatically.

## [UX Guidelines](https://code.visualstudio.com/api/extension-capabilities/overview\#ux-guidelines)

To help make your extension fit seamlessly into the VS Code user interface, refer to the [UX Guidelines](https://code.visualstudio.com/api/ux-guidelines/overview), where you'll learn the best practices for creating extension UI and conventions for following the preferred VS Code workflows.

## [Restrictions](https://code.visualstudio.com/api/extension-capabilities/overview\#restrictions)

There are certain restrictions we impose upon extensions. Here are the restrictions and their purposes.

### [No DOM Access](https://code.visualstudio.com/api/extension-capabilities/overview\#no-dom-access)

Extensions have no access to the DOM of VS Code UI. You **cannot** write an extension that applies custom CSS to VS Code or adds an HTML element to VS Code UI.

At VS Code, we're continually trying to optimize use of the underlying web technologies to deliver an always available, highly responsive editor and we will continue to tune our use of the DOM as these technologies and our product evolve. To ensure that extensions cannot interfere with the stability and performance of VS Code, and that we can continue to improve the DOM of VS Code without breaking existing extensions, we run extensions in an [Extension Host](https://code.visualstudio.com/api/advanced-topics/extension-host) process and prevent direct access to the DOM.

### [No custom style sheets](https://code.visualstudio.com/api/extension-capabilities/overview\#no-custom-style-sheets)

A custom style sheet provided by users or extensions would work against the DOM structure and class names. These are not documented as we consider them internal. To evolve, refactor, or improve VS Code, we need the freedom to make changes to the user interface. Any change to the DOM can break existing custom style sheets, resulting in frustration for style sheet providers and a bad user experience with UI glitches coming from the broken style sheet.

Instead, VS Code aims to provide a well-designed extension API supporting UI customizations. The API is documented, comes with tooling and samples, and is kept stable across all upcoming releases of VS Code.

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)