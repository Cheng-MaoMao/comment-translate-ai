Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/ux-guidelines/webviews.md "Edit this document in vscode.dev")

# Webviews

If you need to display custom functionality that is beyond what the VS Code API supports, you can use [webviews](https://code.visualstudio.com/api/extension-guides/webview), which are fully customizable. It's important to understand that webviews should only be used if you absolutely need them.

**✔️ Do**

- Only use webviews when absolutely necessary
- Activate your extension only when contextually appropriate
- Open webviews only for the active window
- Ensure all elements in the view are themeable (see the [webview-view-sample](https://github.com/microsoft/vscode-extension-samples/blob/main/webview-view-sample/media/main.css) and [color tokens](https://code.visualstudio.com/api/references/theme-color) documentation)
- Ensure your views follow [accessibility guidance](https://code.visualstudio.com/docs/configure/accessibility/accessibility) (color contrast, ARIA labels, keyboard navigation)
- Use command actions in the toolbar and in the view

❌ Don't

- Use for promotions (upgrades, sponsors, etc.)
- Use for wizards
- Open on every window
- Open on extension updates (ask via a Notification instead)
- Add functionality that is unrelated to the editor or workspace
- Repeat existing functionality (Welcome page, Settings, configuration, etc.)

## [Webview examples](https://code.visualstudio.com/api/ux-guidelines/webviews\#webview-examples)

**Simple Browser**

This extension opens a browser preview for the editor to the side.

![Weview sample - Browser](https://code.visualstudio.com/assets/api/ux-guidelines/examples/webview-browser.png)

_This example shows VS Code Web being developed right inside VS Code. A Webview panel is used to render a browser-like window._

**Pull Request**

This extension shows pull requests for the repository of the workspace in a custom tree view and then uses a webview for a detail view of the pull request.

![Webview sample - Pull Request](https://code.visualstudio.com/assets/api/ux-guidelines/examples/webview-pull-request.png)

## [Webview views](https://code.visualstudio.com/api/ux-guidelines/webviews\#webview-views)

You can also place webviews into any view container (sidebar or panel) and these elements are called [webview views](https://code.visualstudio.com/api/references/vscode-api#WebviewView). The same webview guidance applies to webview views.

![Webview View](https://code.visualstudio.com/assets/api/ux-guidelines/examples/webview-view.png)

_This webview view shows content for creating a pull request that uses dropdowns, inputs, and buttons._

## [Links](https://code.visualstudio.com/api/ux-guidelines/webviews\#links)

- [Webview extension guide](https://code.visualstudio.com/api/extension-guides/webview)
- [Webview extension sample](https://github.com/Microsoft/vscode-extension-samples/tree/main/webview-sample)
- [Webview View extension sample](https://github.com/microsoft/vscode-extension-samples/tree/main/webview-view-sample)

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)