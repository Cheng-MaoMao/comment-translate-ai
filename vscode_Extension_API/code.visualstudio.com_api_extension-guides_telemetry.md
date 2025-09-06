Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/extension-guides/telemetry.md "Edit this document in vscode.dev")

# Telemetry extension authors guide

Visual Studio Code collects usage data and sends it to Microsoft to help improve our products and services. Read our [privacy statement](https://go.microsoft.com/fwlink/?LinkID=528096&clcid=0x409) and [telemetry documentation](https://code.visualstudio.com/docs/getstarted/telemetry) to learn more.

This topic has guidelines for extension authors so that their extensions can conform to VS Code telemetry requirements and best practices.

> **Note**: If you don't want to send usage data to Microsoft, you can set the `telemetry.telemetryLevel` user [setting](https://code.visualstudio.com/docs/configure/settings) to `off`.

## [Telemetry module](https://code.visualstudio.com/api/extension-guides/telemetry\#telemetry-module)

The VS Code team maintains the [@vscode/extension-telemetry](https://www.npmjs.com/package/@vscode/extension-telemetry) npm module that provides a consistent and safe way to collect telemetry within VS Code. The module reports telemetry to [Azure Monitor and Application Insights](https://azure.microsoft.com/services/monitor/) and guarantees backwards compatibility against previous versions of VS Code.

Follow this guide to set up [Azure Monitor](https://learn.microsoft.com/azure/azure-monitor/app/nodejs) and get your Application Insights instrumentation key.

## [Without the telemetry module](https://code.visualstudio.com/api/extension-guides/telemetry\#without-the-telemetry-module)

Extension authors who wish not to use Application Insights can utilize their own custom solution to send telemetry. In this case, it is still required that extension authors respect the user's choice by utilizing the `isTelemetryEnabled` and `onDidChangeTelemetryEnabled` API. By doing this, users will have one centralized place to control their telemetry settings.

## [Custom telemetry setting](https://code.visualstudio.com/api/extension-guides/telemetry\#custom-telemetry-setting)

Extension may wish to give user control for extension specific telemetry independent of VS Code telemetry. In this case, we suggest that you introduce a specific extension setting. It is recommended that custom telemetry settings be tagged with `telemetry` and `usesOnlineServices` so that users can more easily query them in the Settings UI. Adding a custom telemetry setting is not an exemption from respecting a user's decision and the `isTelemetryEnabled` and `onDidChangeTelemetryEnabled` flag must always be respected. If `isTelemetryEnabled` reports false, even if your setting is enabled, telemetry must not be sent.

## [telemetry.json](https://code.visualstudio.com/api/extension-guides/telemetry\#telemetry.json)

We understand that telemetry can be a sensitive topic for many users and we aim to be as transparent as possible. The core VS Code product and most first party extensions ship with a `telemetry.json` file in their root. This allows a user to use the VS Code CLI with the `--telemetry` flag to receive a dump of all telemetry that VS Code produces. Extension authors may include a `telemetry.json` file in their root and it will also appear in the CLI dump.

## [Do's and Don'ts](https://code.visualstudio.com/api/extension-guides/telemetry\#dos-and-donts)

✔️ Do

- Use the [@vscode/extension-telemetry](https://www.npmjs.com/package/@vscode/extension-telemetry) npm module if using application insights works for you.
- Otherwise, respect the `isTelemetryEnabled` and `onDidChangeTelemetryEnabled` API.
- Tag your custom telemetry setting with `telemetry` and `usesOnlineServices` if you have one.
- Collect as little telemetry as possible.
- Be as transparent as possible to your users about what you collect.

❌ Don't

- Introduce a custom telemetry collection solution that does not ask for user consent.
- Collect Personally identifiable information (PII).
- Collect more telemetry than necessary.
- Use just the `telemetry.telemetryLevel` setting, as it can sometimes be incorrect compared to `isTelemetryEnabled`.

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)