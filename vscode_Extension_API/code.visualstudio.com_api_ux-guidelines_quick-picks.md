Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/ux-guidelines/quick-picks.md "Edit this document in vscode.dev")

# Quick Picks

[Quick Picks](https://code.visualstudio.com/api/extension-capabilities/common-capabilities#quick-pick) are an easy way to perform actions and receive input from the user. This is helpful when selecting a configuration option, needing to filter content, or picking from a list of items.

![Quick Pick example](https://code.visualstudio.com/assets/api/ux-guidelines/examples/quick-pick.png)

**✔️ Do**

- Use icons for clear metaphors
- Use thoughtful icons that add clarity and help differentiate items
- Use the description for displaying the current items (if applicable)
- Use the detail for providing (brief) additional context
- Use the multi-step pattern for a series of basic inputs
- Provide an option to create a new item when picking from a list (if applicable)
- Use a title for multi-step quick picks
- Use a title for quick picks without a text input
- Use a title for quick picks asking for text input (use the placeholder to show a hint or example)
- Use a title for quick picks featuring global buttons (e.g. a refresh icon)

❌ Don't

- Repeat existing functionality
- Use a title when the placeholder can describe the purpose on its own
- Use inputs without a placeholder

## [Multiple steps](https://code.visualstudio.com/api/ux-guidelines/quick-picks\#multiple-steps)

Quick Picks can be configured to feature multiple steps. Use these when you need to capture related-but-separate selections in a single flow. Avoid using quick picks for long flows with many steps—they aren't well suited to function as a wizard or similarly complex experience.

![Multi-step Quick Pick example](https://code.visualstudio.com/assets/api/ux-guidelines/examples/quick-pick-multi-step.png)

_Note the "1/3" text in the Quick Pick title that indicates the current and total number of steps in the flow._

## [Multiple selections](https://code.visualstudio.com/api/ux-guidelines/quick-picks\#multiple-selections)

Use a multi-select quick pick for closely-related selections that need to be selected in one step.

![Multi-step Quick Pick example](https://code.visualstudio.com/assets/api/ux-guidelines/examples/quick-pick-multi-select.png)

## [Title](https://code.visualstudio.com/api/ux-guidelines/quick-picks\#title)

Quick Picks can also be configured to show a title bar above the main input and selection UI. Use a title when the user needs more context for the selection being made. Avoid using a title that uses a label already used in the Quick Pick's input placeholder.

![Multi-step Quick Pick example](https://code.visualstudio.com/assets/api/ux-guidelines/examples/quick-pick-title.png)

## [Using separators](https://code.visualstudio.com/api/ux-guidelines/quick-picks\#using-separators)

Quick Pick items can be grouped into clear sections using Quick Pick separators. These feature a divider and label to clearly show the section. Use separators if the extension features a quick pick containing multiple obvious groups of selections.

![Quick Pick with separators](https://code.visualstudio.com/assets/api/ux-guidelines/examples/quick-pick-separators.png)

## [Links](https://code.visualstudio.com/api/ux-guidelines/quick-picks\#links)

- [Quick Pick API reference](https://code.visualstudio.com/api/references/vscode-api#QuickPick)
- [Quick Pick Item API reference](https://code.visualstudio.com/api/references/vscode-api#QuickPickItem)
- [Quick Pick extension sample](https://github.com/microsoft/vscode-extension-samples/tree/main/quickinput-sample)

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)