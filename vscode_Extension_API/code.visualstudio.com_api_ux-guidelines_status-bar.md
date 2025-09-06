Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/ux-guidelines/status-bar.md "Edit this document in vscode.dev")

# Status Bar

The [Status Bar](https://code.visualstudio.com/api/extension-capabilities/extending-workbench#status-bar-item) sits at the bottom of the VS Code workbench and displays information and actions that relate to your workspace. Items are placed into two groups: Primary (left) and Secondary (right). Items that relate to the entire workspace (status, problems/warnings, sync) go on the left and items that are secondary or contextual (language, spacing, feedback) go on the right. Limit the number of items added, as other extensions contribute to the same area.

![Status Bar example](https://code.visualstudio.com/assets/api/ux-guidelines/examples/status-bar.png)

**✔️ Do**

- Use short text labels
- Use icons only when necessary
- Use icons only for clear metaphors
- Place primary (global) items on the left
- Place secondary (contextual) items on the right

**❌ Don't**

- Add custom colors
- Add more than one icon (unless necessary)
- Add more than one item (unless necessary)

## [Status Bar Items](https://code.visualstudio.com/api/ux-guidelines/status-bar\#status-bar-items)

![Status Bar Item](https://code.visualstudio.com/assets/api/ux-guidelines/examples/status-bar-item.png)

_This example shows an item contributed by the GitHub Pull Requests and Issues extension. It relates to the entire workspace, so it is placed on the left._

### [Progress Status Bar item](https://code.visualstudio.com/api/ux-guidelines/status-bar\#progress-status-bar-item)

When needing to show discreet progress (progress happening in the background), it's recommended to show a Status Bar item with the loading icon (you can also add spin animation). If progress needs to be elevated for user attention, we recommend moving to a progress notification.

![Status Bar Progress](https://code.visualstudio.com/assets/api/ux-guidelines/examples/status-bar-progress.png)

_This example shows a progress Status Bar item that is discreet._

### [Error and Warning Status Bar Items](https://code.visualstudio.com/api/ux-guidelines/status-bar\#error-and-warning-status-bar-items)

If you need to show an item that is highly visible for warning or error purposes, you can configure a Status Bar Item to use a warning or error background color. Only use this pattern as a last resort and only for special cases given their prominence in the Status Bar.

![Status Bar Error](https://code.visualstudio.com/assets/api/ux-guidelines/examples/status-bar-error.png)

_This example uses the error Status Bar Item for showing a blocking error in the file._

![Status Bar Warning](https://code.visualstudio.com/assets/api/ux-guidelines/examples/status-bar-warning.png)

_This example uses the warning Status Bar Item for showing a warning in the file._

## [Links](https://code.visualstudio.com/api/ux-guidelines/status-bar\#links)

- [Status Bar Item API reference](https://code.visualstudio.com/api/references/vscode-api#StatusBarItem)
- [Status Bar extension sample](https://github.com/microsoft/vscode-extension-samples/tree/main/statusbar-sample)

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)