Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/extension-capabilities/extending-workbench.md "Edit this document in vscode.dev")

# Extending Workbench

"Workbench" refers to the overall Visual Studio Code UI that encompasses the following UI components:

- Title Bar
- Activity Bar
- Side Bar
- Panel
- Editor Group
- Status Bar

VS Code provides various APIs that allow you to add your own components to the Workbench. For example, in the image below:

![workbench-contribution](https://code.visualstudio.com/assets/api/extension-capabilities/extending-workbench/workbench-contribution.png)

- Activity Bar: The [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) adds a [View Container](https://code.visualstudio.com/api/extension-capabilities/extending-workbench#views-container)
- Side Bar: The built-in [NPM extension](https://github.com/microsoft/vscode/tree/main/extensions/npm) adds a [Tree View](https://code.visualstudio.com/api/extension-capabilities/extending-workbench#tree-view) to the Explorer View
- Editor Group: The built-in [Markdown extension](https://github.com/microsoft/vscode/tree/main/extensions/markdown-language-features) adds a [Webview](https://code.visualstudio.com/api/extension-capabilities/extending-workbench#webview) next to other editors in the Editor Group
- Status Bar: The [VSCodeVim extension](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim) adds a [Status Bar Item](https://code.visualstudio.com/api/extension-capabilities/extending-workbench#status-bar-item) in the Status Bar

## [Views Container](https://code.visualstudio.com/api/extension-capabilities/extending-workbench\#views-container)

With the [`contributes.viewsContainers`](https://code.visualstudio.com/api/references/contribution-points#contributes.viewsContainers) Contribution Point, you can add new Views Containers that display next to the five built-in Views Containers. Learn more at the [Tree View](https://code.visualstudio.com/api/extension-guides/tree-view) topic.

## [Tree View](https://code.visualstudio.com/api/extension-capabilities/extending-workbench\#tree-view)

With the [`contributes.views`](https://code.visualstudio.com/api/references/contribution-points#contributes.views) Contribution Point, you can add new Views that display in any of the View Containers. Learn more at the [Tree View](https://code.visualstudio.com/api/extension-guides/tree-view) topic.

## [Webview](https://code.visualstudio.com/api/extension-capabilities/extending-workbench\#webview)

Webviews are highly customizable views built with HTML/CSS/JavaScript. They display next to text editors in the Editor Group areas. Read more about Webview in the [Webview guide](https://code.visualstudio.com/api/extension-guides/webview).

## [Status Bar Item](https://code.visualstudio.com/api/extension-capabilities/extending-workbench\#status-bar-item)

Extensions can create custom [`StatusBarItem`](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem) that display in the Status Bar. Status Bar Items can show text and icons and run commands on click events.

- Show text and icons
- Run a command on click

You can learn more by reviewing the [Status Bar extension sample](https://github.com/microsoft/vscode-extension-samples/tree/main/statusbar-sample).

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)