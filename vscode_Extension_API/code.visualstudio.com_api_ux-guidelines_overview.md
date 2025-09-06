Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/ux-guidelines/overview.md "Edit this document in vscode.dev")

# UX Guidelines

These guidelines cover the best practices for creating extensions that seamlessly integrate with VS Code's native interface and patterns. In these guidelines, you can expect to find:

- An outline of VS Code's overall UI architecture and elements
- Recommendations and examples for UI contributed by an extension
- Links to relevant guides and samples

Before diving into the details, it's important to understand how the various architectural UI parts of VS Code fit together and how and where your extension could contribute.

## [Containers](https://code.visualstudio.com/api/ux-guidelines/overview\#containers)

The VS Code interface can roughly be divided into two main concepts: **containers** and **items**. Generally speaking, containers can be considered the larger sections of the VS Code interface that render one or more items:

[![Overview of Visual Studio Code containers elements](https://code.visualstudio.com/assets/api/ux-guidelines/examples/architecture-containers.png)](https://code.visualstudio.com/assets/api/ux-guidelines/examples/architecture-containers.png)

### [Activity Bar](https://code.visualstudio.com/api/ux-guidelines/overview\#activity-bar)

The [Activity Bar](https://code.visualstudio.com/api/ux-guidelines/activity-bar) is a core navigation surface in VS Code. Extensions can contribute items to the Activity Bar that function as [View Containers](https://code.visualstudio.com/api/references/contribution-points#contributes.viewsContainers) that render [Views](https://code.visualstudio.com/api/ux-guidelines/views) in the Primary Sidebar.

### [Primary Sidebar](https://code.visualstudio.com/api/ux-guidelines/overview\#primary-sidebar)

The [Primary Sidebar](https://code.visualstudio.com/api/ux-guidelines/sidebars#primary-sidebar) renders one or more [Views](https://code.visualstudio.com/api/ux-guidelines/views). The Activity Bar and the Primary Sidebar are tightly coupled. Clicking on a contributed Activity Bar Item (read: View Container) opens up the Primary Sidebar where one or more View associated with that View Container will be rendered. A concrete example would be the Explorer. Clicking on the Explorer Item will open up the Primary Sidebar where the Folder(s), Timeline, and Outline Views are visible.

### [Secondary Sidebar](https://code.visualstudio.com/api/ux-guidelines/overview\#secondary-sidebar)

The [Secondary Sidebar](https://code.visualstudio.com/api/ux-guidelines/sidebars#secondary-sidebar) also functions as a surface for rendering a View Container with Views. Users can drag views like the Terminal or the Problems view to the Secondary Sidebar to customize their layout.

### [Editor](https://code.visualstudio.com/api/ux-guidelines/overview\#editor)

The Editor area contains one or more Editor Groups. Extensions can contribute [Custom Editors](https://code.visualstudio.com/api/references/contribution-points#contributes.customEditors) or [Webviews](https://code.visualstudio.com/api/extension-guides/webview) to open in the Editor area. They can also contribute [Editor Actions](https://code.visualstudio.com/api/ux-guidelines/editor-actions) to expose additional icon buttons in the Editor Toolbar.

### [Panel](https://code.visualstudio.com/api/ux-guidelines/overview\#panel)

The [Panel](https://code.visualstudio.com/api/ux-guidelines/panel) is another area for exposing View Containers. By default, Views like the Terminal, Problems, and Output can be viewed in a single tab at a time in the Panel. Users can also drag views into a split layout much like they can do in the Editor. Additionally, extensions can choose to add View Containers specifically to the Panel instead of the Activity Bar/Primary Sidebar.

### [Status Bar](https://code.visualstudio.com/api/ux-guidelines/overview\#status-bar)

The [Status Bar](https://code.visualstudio.com/api/ux-guidelines/status-bar) provides contextual information about the workspace and currently active file. It renders two groups of [Status Bar Items](https://code.visualstudio.com/api/ux-guidelines/status-bar#status-bar-items).

## [Items](https://code.visualstudio.com/api/ux-guidelines/overview\#items)

Extensions can add items to the various containers listed above.

[![Overview of Visual Studio Code containers elements](https://code.visualstudio.com/assets/api/ux-guidelines/examples/architecture-sections.png)](https://code.visualstudio.com/assets/api/ux-guidelines/examples/architecture-sections.png)

### [View](https://code.visualstudio.com/api/ux-guidelines/overview\#view)

[Views](https://code.visualstudio.com/api/ux-guidelines/views) can be contributed in the form of a [Tree View](https://code.visualstudio.com/api/ux-guidelines/views#tree-views), [Welcome View](https://code.visualstudio.com/api/ux-guidelines/views#welcome-views), or [Webview View](https://code.visualstudio.com/api/ux-guidelines/webviews#webview-views) and can be dragged around to other areas of the interface.

### [View Toolbar](https://code.visualstudio.com/api/ux-guidelines/overview\#view-toolbar)

Extensions can expose View-specific [actions](https://code.visualstudio.com/api/ux-guidelines/views#view-actions) that appear as buttons on a View Toolbar.

### [Sidebar Toolbar](https://code.visualstudio.com/api/ux-guidelines/overview\#sidebar-toolbar)

Actions scoped to an entire View Container can also be exposed in the [Sidebar Toolbar](https://code.visualstudio.com/api/ux-guidelines/sidebars#sidebar-toolbars).

### [Editor Toolbar](https://code.visualstudio.com/api/ux-guidelines/overview\#editor-toolbar)

Extensions can contribute [Editor Actions](https://code.visualstudio.com/api/ux-guidelines/editor-actions) scoped to an editor directly in the Editor Toolbar.

### [Panel Toolbar](https://code.visualstudio.com/api/ux-guidelines/overview\#panel-toolbar)

The [Panel Toolbar](https://code.visualstudio.com/api/ux-guidelines/panel#panel-toolbar) can expose options scoped to the currently selected View. For example the Terminal view exposes actions to add a new terminal, split the view layout, and more. Switching to the Problems view exposes a different set of actions.

### [Status Bar Item](https://code.visualstudio.com/api/ux-guidelines/overview\#status-bar-item)

On the left, [Status Bar Items](https://code.visualstudio.com/api/ux-guidelines/status-bar#status-bar-items) are scoped to the entire Workspace. On the right, items are scoped to the active file.

## [Common UI Elements](https://code.visualstudio.com/api/ux-guidelines/overview\#common-ui-elements)

### [Command Palette](https://code.visualstudio.com/api/ux-guidelines/overview\#command-palette)

Extensions can contribute Commands that appears in the [Command Palette](https://code.visualstudio.com/api/ux-guidelines/command-palette) to quickly execute some functionality.

[![Overview of the Command Palette element](https://code.visualstudio.com/assets/api/ux-guidelines/examples/command-palette.png)](https://code.visualstudio.com/assets/api/ux-guidelines/examples/command-palette.png)

### [Quick Pick](https://code.visualstudio.com/api/ux-guidelines/overview\#quick-pick)

[Quick Picks](https://code.visualstudio.com/api/ux-guidelines/quick-picks) capture a user's input in several different ways. They can ask for a single selection, multiple selections, or even freeform text input.

![Overview of the Quick Pick element](https://code.visualstudio.com/assets/api/ux-guidelines/examples/quick-pick.png)

### [Notifications](https://code.visualstudio.com/api/ux-guidelines/overview\#notifications)

[Notifications](https://code.visualstudio.com/api/ux-guidelines/notifications) are used to communicate information, warning, and error messages to users. They can also be used to indicate progress.

![Overview of the Notification element](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification.png)

### [Webviews](https://code.visualstudio.com/api/ux-guidelines/overview\#webviews)

[Webviews](https://code.visualstudio.com/api/ux-guidelines/webviews) can be used to display custom content and functionality for use cases that go beyond VS Code's "native" API.

![Overview of the Webview element](https://code.visualstudio.com/assets/api/ux-guidelines/examples/webview.png)

### [Context Menus](https://code.visualstudio.com/api/ux-guidelines/overview\#context-menus)

In contrast to the Command Palette's consistent location, [Context Menus](https://code.visualstudio.com/api/ux-guidelines/context-menus) give users the ability to perform actions or configure something from a specific location.

![Overview of the Context Menu element](https://code.visualstudio.com/assets/api/ux-guidelines/examples/context-menu.png)

### [Walkthroughs](https://code.visualstudio.com/api/ux-guidelines/overview\#walkthroughs)

[Walkthroughs](https://code.visualstudio.com/api/ux-guidelines/walkthroughs) provide a consistent experience for onboarding users to an extension via a multi-step checklist featuring rich content.

![Overview of the Walkthrough API](https://code.visualstudio.com/assets/api/ux-guidelines/examples/walkthrough.png)

### [Settings](https://code.visualstudio.com/api/ux-guidelines/overview\#settings)

[Settings](https://code.visualstudio.com/api/ux-guidelines/settings) enable users to configure options relevant to the extension.

![Overview of the Settings page](https://code.visualstudio.com/assets/api/ux-guidelines/examples/settings.png)

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)