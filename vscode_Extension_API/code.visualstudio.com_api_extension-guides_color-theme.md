Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/extension-guides/color-theme.md "Edit this document in vscode.dev")

# Color Theme

Colors visible in the Visual Studio Code user interface fall in two categories:

- Workbench colors used in views and editors, from the Activity Bar to the Status Bar. A complete list of all these colors can be found in the [theme color reference](https://code.visualstudio.com/api/references/theme-color).
- Syntax colors and styles used for source code in the editor. The theming of these colors is different as syntax colorization is based on TextMate grammars and TextMate themes as well as semantic tokens.

This guide will cover the different ways in which you can create themes.

## [Workbench colors](https://code.visualstudio.com/api/extension-guides/color-theme\#workbench-colors)

The easiest way to create a new workbench color theme is to start with an existing color theme and customize it. First switch to the color theme that you want to modify, then open your [settings](https://code.visualstudio.com/docs/configure/settings) and make changes to the `workbench.colorCustomizations` setting. Changes are applied live to your VS Code instance.

The following, for example, would change the background color of the title bar:

JSON

```
{
  "workbench.colorCustomizations": {
    "titleBar.activeBackground": "#ff0000"
  }
}

```

A complete list of all themable colors can be found in the [color reference](https://code.visualstudio.com/api/references/theme-color).

## [Syntax colors](https://code.visualstudio.com/api/extension-guides/color-theme\#syntax-colors)

For syntax highlighting colors, there are two approaches. You can reference an existing TextMate theme ( `.tmTheme` file) from the community, or you can create your own theming rules. The easiest way is to start with an existing theme and customize it, much like in the workbench colors section above.

First switch to the color theme to customize and use the `editor.tokenColorCustomizations` [settings](https://code.visualstudio.com/docs/configure/settings). Changes are applied live to your VS Code instance and no refreshing or reloading is necessary.

For example, the following would change the color of comments within the editor:

JSON

```
{
  "editor.tokenColorCustomizations": {
    "comments": "#FF0000"
  }
}

```

The setting supports a simple model with a set of common token types such as 'comments', 'strings' and 'numbers' available. If you want to color more than that, you need to use TextMate theme rules directly, which are explained in detail in the [Syntax Highlighting guide](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide).

## [Semantic colors](https://code.visualstudio.com/api/extension-guides/color-theme\#semantic-colors)

Semantic highlighting is available for TypeScript and JavaScript in VS Code release 1.43. We expect it to be adopted by other languages soon.

Semantic highlighting enriches syntax coloring based on symbol information from the language service, which has more complete understanding of the project. The coloring changes appear once the language server is running and has computed the semantic tokens.

Each theme controls whether to enable semantic highlighting with a specific setting that is part of the theme definition. The style of each semantic token is defined by the theme's styling rules.

Users can override the semantic highlighting feature and colorization rules using the `editor.tokenColorCustomizations` setting:

Enable semantic highlighting for a specific theme:

JSON

```
"editor.tokenColorCustomizations": {
    "[Material Theme]": {
        "semanticHighlighting": true
    }
},

```

Themes can define theming rules for semantic tokens as described in the [Syntax Highlighting guide](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide#semantic-theming).

## [Create a new Color Theme](https://code.visualstudio.com/api/extension-guides/color-theme\#create-a-new-color-theme)

Once you have tweaked your theme colors using `workbench.colorCustomizations` and `editor.tokenColorCustomizations`, it's time to create the actual theme.

1. Generate a theme file using the **Developer: Generate Color Theme from Current Settings** command from the **Command Palette**

2. Use VS Code's [Yeoman](https://yeoman.io/) extension generator to generate a new theme extension:



Bash



```
npm install -g yo generator-code
yo code

```

3. If you customized a theme as described above, select 'Start fresh'.

![yo code theme](https://code.visualstudio.com/assets/api/extension-guides/color-theme/yocode-colortheme.png)

4. Copy the theme file generated from your settings to the new extension.


You can also use an existing TextMate theme by telling the extension generator to import a TextMate theme file (.tmTheme) and package it for use in VS Code. Alternatively, if you have already downloaded the theme, replace the `tokenColors` section with a link to the `.tmTheme` file to use.

JSON

```
{
  "type": "dark",
  "colors": {
    "editor.background": "#1e1e1e",
    "editor.foreground": "#d4d4d4",
    "editorIndentGuide.background": "#404040",
    "editorRuler.foreground": "#333333",
    "activityBarBadge.background": "#007acc",
    "sideBarTitle.foreground": "#bbbbbb"
  },
  "tokenColors": "./Diner.tmTheme"
}

```

> **Tip:** Give your color definition file the `-color-theme.json` suffix and you will get hovers, code completion, color decorators, and color pickers when editing.

> **Tip:** [ColorSublime](https://colorsublime.github.io/) has hundreds of existing TextMate themes to choose from. Pick a theme you like and copy the Download link to use in the Yeoman generator or into your extension. It will be in a format like `"https://raw.githubusercontent.com/Colorsublime/Colorsublime-Themes/master/themes/(name).tmTheme"`

## [Test a new Color Theme](https://code.visualstudio.com/api/extension-guides/color-theme\#test-a-new-color-theme)

To try out the new theme, press F5 to launch an Extension Development Host window.

There, open the Color Theme picker with **File** \> **Preferences** \> **Theme** \> **Color Theme** and you can see your theme in the dropdown list. Arrow up and down to see a live preview of your theme.

![select my theme](https://code.visualstudio.com/assets/api/extension-guides/color-theme/mytheme.png)

Changes to the theme file are applied live in the `Extension Development Host` window.

## [Publishing a Theme to the Extension Marketplace](https://code.visualstudio.com/api/extension-guides/color-theme\#publishing-a-theme-to-the-extension-marketplace)

If you'd like to share your new theme with the community, you can publish it to the [Extension Marketplace](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace). Use the [vsce publishing tool](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) to package your theme and publish it to the VS Code Marketplace.

> **Tip:** To make it easy for users to find your theme, include the word "theme" in the extension description and set the `Category` to `Themes` in your `package.json`.

We also have recommendations on how to make your extension look great on the VS Code Marketplace, see [Marketplace Presentation Tips](https://code.visualstudio.com/api/references/extension-manifest#marketplace-presentation-tips).

## [Adding a new Color ID](https://code.visualstudio.com/api/extension-guides/color-theme\#adding-a-new-color-id)

Color IDs can also be contributed by extensions through the [color contribution point](https://code.visualstudio.com/api/references/contribution-points#contributes.colors). These colors also appear when using code complete in the `workbench.colorCustomizations` settings and the color theme definition file. Users can see what colors an extension defines in the [extension contributions](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace#_extension-details) tab.

## [Further reading](https://code.visualstudio.com/api/extension-guides/color-theme\#further-reading)

- [CSS Tricks - Creating a VS Code theme](https://css-tricks.com/creating-a-vs-code-theme/)

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)