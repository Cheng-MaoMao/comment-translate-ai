Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/ux-guidelines/panel.md "Edit this document in vscode.dev")

# Panel

The Panel functions as another main area to display [View Containers](https://code.visualstudio.com/api/references/contribution-points#contributes.viewsContainers).

**✔️ Do**

- Render Views in the Panel that benefit from more horizontal space
- Use for Views that provide supporting functionality

**❌ Don't**

- Use for Views that are meant to be always visible since users often minimize the Panel
- Render custom Webview content that fails to resize/reflow properly when dragged to other View Containers (like the Primary or Secondary Sidebars).

![Example of a panel](https://code.visualstudio.com/assets/api/ux-guidelines/examples/panel.png)

## [Panel Toolbar](https://code.visualstudio.com/api/ux-guidelines/panel\#panel-toolbar)

The Panel Toolbar can expose options scoped to the currently selected View. For example the Terminal view exposes [View Actions](https://code.visualstudio.com/api/extension-guides/tree-view#view-actions) to add a new terminal, split the view layout, and more. Switching to the Problems view exposes a different set of actions. Similar to the [Sidebar Toolbar](https://code.visualstudio.com/api/ux-guidelines/sidebars#sidebar-toolbar), the toolbar will only render if there is just a single View. If more than one View is used, each View will render its own toolbar.

**✔️ Do**

- Use an existing [product icon](https://code.visualstudio.com/api/references/icons-in-labels#icon-listing) if available
- Provide clear, useful tooltips

**❌ Don't**

- Don't add an excessive number of icon buttons. Consider using a [Context Menu](https://code.visualstudio.com/api/references/contribution-points#contributes.menus) if more options are needed for a specific button.
- Don't duplicate the default Panel icons (collapse/expand, close, etc.)

![Example of a panel toolbar with a single view](https://code.visualstudio.com/assets/api/ux-guidelines/examples/panel-toolbar.png)

_In this example, the single View rendered in the Panel renders its View Actions in the main Panel Toolbar._

![Example of a panel toolbar with multiple views](https://code.visualstudio.com/assets/api/ux-guidelines/examples/panel-toolbar-multiple-views.png)

_In this example, multiple Views are used, so each View exposes its own specific View Actions._

## [Links](https://code.visualstudio.com/api/ux-guidelines/panel\#links)

- [View Container contribution point](https://code.visualstudio.com/api/references/contribution-points#contributes.viewsContainers)
- [View contribution point](https://code.visualstudio.com/api/references/contribution-points#contributes.views)
- [View Actions extension guide](https://code.visualstudio.com/api/extension-guides/tree-view#view-actions)

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)