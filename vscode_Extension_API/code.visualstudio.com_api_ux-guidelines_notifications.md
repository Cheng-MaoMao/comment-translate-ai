Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/ux-guidelines/notifications.md "Edit this document in vscode.dev")

# Notifications

[Notifications](https://code.visualstudio.com/api/extension-capabilities/common-capabilities#display-notifications) display brief information that is surfaced from the bottom right of VS Code.

![Example of a notification](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification.png)

You can send three types of notifications:

- [Information](https://code.visualstudio.com/api/references/vscode-api#window.showInformationMessage)
- [Warning](https://code.visualstudio.com/api/references/vscode-api#window.showWarningMessage)
- [Error](https://code.visualstudio.com/api/references/vscode-api#window.showErrorMessage)

It's important to limit the number of notifications sent in order to respect the user's attention. To help guide your decision on whether or not you should show a notification, please follow our notification decision tree:

[![Show a multi-step quick pick if multi step user input is immediately needed. If user input is immediately needed but it is not multi-step show a modal dialog. If you need to show progress that is low priority show the progress in the status bar. If the interaction is triggered by the user find the right moment to show the notification and only then show it. If you need to show multiple notifications try to combine them into one. If the user does not really need to be notified consider to not show anything and relax.](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification-decision-tree.png)](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification-decision-tree.png)

## [Notification examples](https://code.visualstudio.com/api/ux-guidelines/notifications\#notification-examples)

![Information notification](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification-info.png)

_This notification appears after the user runs an **Update version** command. Notice that there are no additional actions and is purely informational._

![Warning notification](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification-warning.png)

_This example highlights an issue with a feature that requires user input and shows actions to resolve the issue._

![Error notification](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification-error.png)

_This example shows a failure notification with an action to resolve the issue._

**✔️ Do**

- Respect the user's attention by only sending notifications when absolutely necessary
- Add a **Do not show again** option for every notification
- Show one notification at a time

**❌ Don't**

- Send repeated notifications
- Use for promotion
- Ask for feedback on the first install
- Show actions if there aren't any

## [Progress notification](https://code.visualstudio.com/api/ux-guidelines/notifications\#progress-notification)

When needing to display progress for an indeterminate timeframe (for example, setting up an environment), you can use the progress notification. This type of global progress notification should be used as a last resort as progress is best kept within context (within a view or editor).

**✔️ Do**

- Show a link to see more details (like logs)
- Show information as setup progresses (initializing, building, etc.)
- Provide an action to cancel the operation (if applicable)
- Add timers for timed out scenarios

**❌ Don't**

- Leave a notification running in progress

![Progress notification](https://code.visualstudio.com/assets/api/ux-guidelines/examples/notification-progress.png)

_This example uses the progress notification to show the setup involved for a remote connection, while also providing a link to the output logs ( **details**)._

## [Modal dialog](https://code.visualstudio.com/api/ux-guidelines/notifications\#modal-dialog)

When you need immediate user input for an action, you can opt to show a modal dialog. This UI element should be used with caution because a modal dialog blocks user interactions outside the dialog, until it's dismissed.

![Modal dialog](https://code.visualstudio.com/assets/api/ux-guidelines/examples/save-ai-generated-changes-dialog.png)

_This dialog appears after moving a JavaScript/TypeScript file, asking to update import statements in other files._

**✔️ Do**

- Only use modal dialogs if you need immediate user interaction
- Where appropriate, provide an action to avoid repeated user confirmation ( _Always_/ _Never_ action)
- Consider using a checkbox to remember the user's choice

**❌ Don't**

- Use modal dialogs to confirm multiple steps
- Use modal dialogs for showing messages that don't require an action from the user
- Show a modal dialog for actions that are not explicitly initiated by the user

## [Links](https://code.visualstudio.com/api/ux-guidelines/notifications\#links)

- [Hello World extension sample](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-sample)
- [Notifications extension sample](https://github.com/microsoft/vscode-extension-samples/tree/main/notifications-sample)

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)