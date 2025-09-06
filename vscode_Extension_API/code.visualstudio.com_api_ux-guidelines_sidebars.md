Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/ux-guidelines/sidebars.md "Edit this document in vscode.dev")

# Sidebars

The Primary and Secondary Sidebars consists of one or more [Views](https://code.visualstudio.com/api/ux-guidelines/views) contributed by a [View Container](https://code.visualstudio.com/api/ux-guidelines/views#view-containers). Extensions can contribute Views to an existing View Container (for example, Explorer) or they can contribute an entirely new View Container.

**✔️ Do**

- Group related Views and content together
- Use clear, descriptive names for View Containers and their Views

**❌ Don't**

- Use an excessive number of View Containers. A single View Container (such as a Sidebar with Views unique to that extension) is generally enough for most extensions.
- Use an excessive number of Views (3-5 is a comfortable max for most screen sizes)
- Add content to the Sidebar that could be a simple Command.
- Repeat existing functionality

![Example of two sidebars](https://code.visualstudio.com/assets/api/ux-guidelines/examples/sidebars.png)

## [Primary Sidebar](https://code.visualstudio.com/api/ux-guidelines/sidebars\#primary-sidebar)

Many extensions choose to contribute Views and/or View Containers to the Primary Sidebar given the high visibility it gives content. Use good judgement when adding content here—too much contributed UI can lead to a cluttered experience that can confuse your users.

![Example of the primary sidebar](https://code.visualstudio.com/assets/api/ux-guidelines/examples/primary-sidebar.png)

## [Secondary Sidebar](https://code.visualstudio.com/api/ux-guidelines/sidebars\#secondary-sidebar)

As the name implies, the Secondary Sidebar is normally considered a auxiliary location for Views. While extensions cannot contribute Views directly to it by default, users can drag Views from the Primary Sidebar or the Panel to customize their layout.

![Example of the secondary sidebar](https://code.visualstudio.com/assets/api/ux-guidelines/examples/secondary-sidebar.png)

## [Sidebar Toolbars](https://code.visualstudio.com/api/ux-guidelines/sidebars\#sidebar-toolbars)

By default, View Containers in the Sidebar with more than one View will feature a single `...` icon button in the Sidebar Toolbar to show and hide each View. That looks something like this:

![Sidebar with two views](https://code.visualstudio.com/assets/api/ux-guidelines/examples/sidebar-toolbar-default.png)

However, if only one View is used, the Sidebar will automatically consolidate the UI to use the Sidebar Toolbar to render all of the actions specific to that View. In place of the `...` button, the two actions associated with the 'Notes' View are rendered in its place:

![Sidebar with a single view and toolbar with actions](https://code.visualstudio.com/assets/api/ux-guidelines/examples/sidebar-toolbar-actions.png)

As with other toolbars, be careful to not add too many actions to reduce clutter and confusion. If possible, use an existing product icon paired with a descriptive Command name.

## [Links](https://code.visualstudio.com/api/ux-guidelines/sidebars\#links)

- [View Container contribution point](https://code.visualstudio.com/api/references/contribution-points#contributes.viewsContainers)
- [View contribution point](https://code.visualstudio.com/api/references/contribution-points#contributes.views)
- [View Actions extension guide](https://code.visualstudio.com/api/extension-guides/tree-view#view-actions)
- [Welcome View contribution point](https://code.visualstudio.com/api/references/contribution-points#contributes.viewsWelcome)
- [Tree View extension sample](https://github.com/microsoft/vscode-extension-samples/tree/main/tree-view-sample)
- [Webview View extension sample](https://github.com/microsoft/vscode-extension-samples/tree/main/webview-view-sample)
- [Welcome View extension sample](https://github.com/microsoft/vscode-extension-samples/tree/main/welcome-view-content-sample)

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)