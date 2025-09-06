Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/extension-capabilities/theming.md "Edit this document in vscode.dev")

# Theming

In Visual Studio Code, there are three types of themes:

- **Color Theme**: A mapping from both UI Component Identifier and Text Token Identifier to colors. Color theme allows you to apply your favorite colors to both VS Code UI Components and the text in the editor.
- **File Icon Theme**: A mapping from file type / file name to images. File icons are displayed across the VS Code UI in places such as File Explorer, Quick Open List, and Editor Tab.
- **Product Icon Theme**: A set of icons used throughout the UI, from the Side bar, the Activity bar, status bar to the editor glyph margin.

## [Color Theme](https://code.visualstudio.com/api/extension-capabilities/theming\#color-theme)

![color-theme](https://code.visualstudio.com/assets/api/extension-capabilities/theming/color-theme.png)

As you can see in the illustration, Color Theme defines colors for UI components as well as for highlighting in the editor:

- The `colors` mapping that controls colors for UI Components.
- The `tokenColors` define the color and styles for highlighting in the editor. The [Syntax Highlight guide](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide) has more information on that topic.
- The `semanticTokenColors` mappings as well as the `semanticHighlighting` setting allow to enhance the highlighting in the editor. The [Semantic Highlight guide](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide) explains the APIs related to that.

We have a [Color Theme guide](https://code.visualstudio.com/api/extension-guides/color-theme) and a [Color Theme sample](https://github.com/microsoft/vscode-extension-samples/tree/main/theme-sample) that illustrates how to create a theme.

## [File Icon Theme](https://code.visualstudio.com/api/extension-capabilities/theming\#file-icon-theme)

File icon themes allow you to:

- Create a mapping from unique file icon identifiers to images or font icons.
- Associate files to these unique file icon identifiers by filenames or file language types.

The [File Icon Theme guide](https://code.visualstudio.com/api/extension-guides/file-icon-theme) discusses how to create a File Icon Theme.
![file-icon-theme](https://code.visualstudio.com/assets/api/extension-capabilities/theming/file-icon-theme.png)

## [Product Icon Theme](https://code.visualstudio.com/api/extension-capabilities/theming\#product-icon-theme)

Product icon themes allow you to:

Redefine all the built-in icons used in the workbench. Examples are the icons in filter action buttons and view icons, in the status bar, breakpoints and the folding icons in trees and the editor.

The [Product Icon Theme guide](https://code.visualstudio.com/api/extension-guides/product-icon-theme) discusses how to create a Product Icon Theme.

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)