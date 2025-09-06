Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/get-started/wrapping-up.md "Edit this document in vscode.dev")

# Wrapping Up

In the [Your First Extension](https://code.visualstudio.com/api/get-started/your-first-extension) topic, you learned how to create, run, and debug an extension. In the [Extension Anatomy](https://code.visualstudio.com/api/get-started/extension-anatomy) topic, you learned fundamental concepts to Visual Studio Code extension development. However, we have only seen the tip of the iceberg, and here are some suggested routes for furthering your VS Code extension development skills.

## [Extension Capabilities](https://code.visualstudio.com/api/get-started/wrapping-up\#extension-capabilities)

In this section, we split the [VS Code API](https://code.visualstudio.com/api/references/vscode-api) and [Contribution Points](https://code.visualstudio.com/api/references/contribution-points) into a few categories, each with short descriptions as to what your extension could achieve. Validate that your extension idea is achievable by reviewing the [VS Code API](https://code.visualstudio.com/api/references/vscode-api) or reading the [Extension Capabilities](https://code.visualstudio.com/api/extension-capabilities/overview) section for new extension ideas.

## [Guides & Samples](https://code.visualstudio.com/api/get-started/wrapping-up\#guides-samples)

We have a great collection of sample extensions that you can adapt from, and some of them include a detailed guide that explains the source code. You can find all samples and guides in the [Extension Guide Listing](https://code.visualstudio.com/api/extension-guides/overview) or the [vscode-extension-samples](https://github.com/microsoft/vscode-extension-samples) repository.

## [UX Guidelines](https://code.visualstudio.com/api/get-started/wrapping-up\#ux-guidelines)

To help make your extension fit seamlessly into the VS Code user interface, refer to the [UX Guidelines](https://code.visualstudio.com/api/ux-guidelines/overview), where you'll learn the best practices for creating extension UI and conventions for following the preferred VS Code workflows.

## [Issue Reporting](https://code.visualstudio.com/api/get-started/wrapping-up\#issue-reporting)

VS Code users can report issues by using the **Help: Report Issue...** command ( `workbench.action.openIssueReporter`), or by typing `issue  ` in Quick Open ( `workbench.action.quickOpen`) and then selecting an installed extension. This provides a consistent experience for users to report issues for the core product or installed extensions.

As an extension author, you can integrate your extension in the **Help: Report Issue...** issue reporter flow, instead of contributing a separate issue reporter command. This integration also enables you to attach any additional information when users report an issue.

To integrate in the issue reporter flow, you need to contribute a custom command and a `issue/reporter` menu contribution point. This custom command will invoke `openIssueReporter`.

An example of a contributed command and menu for `contributes` in `package.json` (See [Contribution Points](https://code.visualstudio.com/api/references/contribution-points) for adding a menu contribution and command):

JSON

```
"commands": [\
    {\
        "command": "extension.myCommand",\
        "title": "Report Issue"\
    }\
],
    "menus": {
        "issue/reporter": [\
            {\
                "command": "extension.myCommand"\
            }\
        ]
    }

```

We ask extensions that previously contributed a `workbench.action.openIssueReporter` command in the command palette to start using this new issue reporting flow.

## [Testing and Publishing](https://code.visualstudio.com/api/get-started/wrapping-up\#testing-and-publishing)

This section includes topics that help you develop high-quality VS Code extensions. For example, you can learn

- How to add [integration tests](https://code.visualstudio.com/api/working-with-extensions/testing-extension) for your extension
- How to [publish your extension](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) to the VS Code [Marketplace](https://marketplace.visualstudio.com/)
- How to set up [Continuous Integration](https://code.visualstudio.com/api/working-with-extensions/continuous-integration) for your extension

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)