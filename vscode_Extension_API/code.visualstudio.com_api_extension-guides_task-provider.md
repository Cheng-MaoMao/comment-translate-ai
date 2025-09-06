Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/extension-guides/task-provider.md "Edit this document in vscode.dev")

# Task Provider

Users normally define [tasks](https://code.visualstudio.com/docs/debugtest/tasks) in Visual Studio Code in a `tasks.json` file. However, there are some tasks during software development that can be automatically detected by a VS Code extension with a Task Provider. When the **Tasks: Run Task** command is run from VS Code, all active Task Providers contribute tasks that the user can run. While the `tasks.json` file lets the user manually define a task for a specific folder or workspace, a Task Provider can detect details about a workspace and then automatically create a corresponding VS Code Task. For example, a Task Provider could check if there is a specific build file, such as `make` or `Rakefile`, and create a build task. This topic describes how extensions can auto-detect and provide tasks to end-users.

This guide teaches you how to build a Task Provider that auto-detects tasks defined in [Rakefiles](https://ruby.github.io/rake/). The complete source code is at: [https://github.com/microsoft/vscode-extension-samples/tree/main/task-provider-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/task-provider-sample).

## [Task Definition](https://code.visualstudio.com/api/extension-guides/task-provider\#task-definition)

To uniquely identify a task in the system, an extension contributing a task needs to define the properties that identify a task. In the Rake example, the task definition looks like this:

JSON

```
"taskDefinitions": [\
    {\
        "type": "rake",\
        "required": [\
            "task"\
        ],\
        "properties": {\
            "task": {\
                "type": "string",\
                "description": "The Rake task to customize"\
            },\
            "file": {\
                "type": "string",\
                "description": "The Rake file that provides the task. Can be omitted."\
            }\
        }\
    }\
]

```

This contributes a task definition for `rake` tasks. The task definition has two attributes `task` and `file`. `task` is the name of the Rake task and `file` points to the `Rakefile` that contains the task. The `task` property is required, the `file` property is optional. If the `file` attribute is omitted, the `Rakefile` in the root of the workspace folder is used.

### [When clause](https://code.visualstudio.com/api/extension-guides/task-provider\#when-clause)

A task definition may optionally have a `when` property. The `when` property specifies the condition under which a task of this type will be available. The `when` property functions in the same way [as other places in VS Code](https://code.visualstudio.com/api/references/when-clause-contexts), where there is a `when` property. The following contexts should always be considered when creating a task definition:

- `shellExecutionSupported`: True when VS Code can run `ShellExecution` tasks, such as when VS Code is run as a desktop application or when using one of the remote extensions, such as Dev Containers.
- `processExecutionSupported`: True when VS Code can run `ProcessExecution` tasks, such as when VS Code is run as a desktop application or when using one of the remote extensions, such as Dev Containers. Currently, it will always have the same value as `shellExecutionSupported`.
- `customExecutionSupported`: True when VS Code can run `CustomExecution`. This is always true.

## [Task provider](https://code.visualstudio.com/api/extension-guides/task-provider\#task-provider)

Analogous to language providers that let extensions support code completion, an extension can register a task provider to compute all available tasks. This is done using the `vscode.tasks` namespace as shown in the following code snippet:

TypeScript

```
import * as vscode from 'vscode';

let rakePromise: Thenable<vscode.Task[]> | undefined = undefined;
const taskProvider = vscode.tasks.registerTaskProvider('rake', {
  provideTasks: () => {
    if (!rakePromise) {
      rakePromise = getRakeTasks();
    }
    return rakePromise;
  },
  resolveTask(_task: vscode.Task): vscode.Task | undefined {
    const task = _task.definition.task;
    // A Rake task consists of a task and an optional file as specified in RakeTaskDefinition
    // Make sure that this looks like a Rake task by checking that there is a task.
    if (task) {
      // resolveTask requires that the same definition object be used.
      const definition: RakeTaskDefinition = <any>_task.definition;
      return new vscode.Task(
        definition,
        _task.scope ?? vscode.TaskScope.Workspace,
        definition.task,
        'rake',
        new vscode.ShellExecution(`rake ${definition.task}`)
      );
    }
    return undefined;
  }
});

```

Like `provideTasks`, the `resolveTask` method is called by VS Code to get tasks from the extension. `resolveTask` can be called instead of `provideTasks`, and is intended to provide an optional performance increase for providers that implement it. For example, if a user has a keybinding that runs an extension provided task, it would be better for VS Code to call `resolveTask` for that task provider and just get the one task quickly instead of having to call `provideTasks` and wait for the extension to provide all of its tasks. It is good practice to have a setting that allows users to turn off individual task providers, so this is common. A user might notice that tasks from a specific provider are slower to get and turn off the provider. In this case, the user might still reference some of the tasks from this provider in their `tasks.json`. If `resolveTask` is not implemented, then there will be a warning that the task in their `tasks.json` was not created. With `resolveTask` an extension can still provide a task for the task defined in `tasks.json`.

The `getRakeTasks` implementation does the following:

- Lists all rake tasks defined in a `Rakefile` using the `rake -AT -f Rakefile` command for each workspace folder.
- Parses the stdio output.
- For every listed task, creates a `vscode.Task` implementation.

Since a Rake task instantiation needs a task definition as defined in the `package.json` file, VS Code also defines the structure using a TypeScript interface like this:

TypeScript

```
interface RakeTaskDefinition extends vscode.TaskDefinition {
  /**
   * The task name
   */
  task: string;

  /**
   * The rake file containing the task
   */
  file?: string;
}

```

Assuming that the output comes from a task called `compile` in the first workspace folder, the corresponding task creation then looks like this:

TypeScript

```
let task = new vscode.Task(
  { type: 'rake', task: 'compile' },
  vscode.workspace.workspaceFolders[0],
  'compile',
  'rake',
  new vscode.ShellExecution('rake compile')
);

```

For every task listed in the output, a corresponding VS Code task is created using the above pattern and then returns the array of all tasks from the `getRakeTasks` call.

The `ShellExecution` executes the `rake compile` command in the shell that is specific for the OS (for example under Windows the command would be executed in PowerShell, under Ubuntu it'd be executed in bash). If the task should directly execute a process (without spawning a shell), `vscode.ProcessExecution` can be used. `ProcessExecution` has the advantage that the extension has full control over the arguments passed to the process. Using `ShellExecution` makes use of the shell command interpretation (like wildcard expansion under bash). If the `ShellExecution` is created with a single command line, then the extension needs to ensure proper quoting and escaping (for example to handle whitespace) inside the command.

## [CustomExecution](https://code.visualstudio.com/api/extension-guides/task-provider\#customexecution)

In general, it is best to use a `ShellExecution` or `ProcessExecution` because they are simple. However, if your task requires a lot of saved state between runs, doesn't work well as a separate script or process, or requires extensive handling of output a `CustomExecution` might be a good fit. Existing uses of `CustomExecution` are usually for complex build systems. A `CustomExecution` has only a callback which is executed at the time that the task is run. This allows for greater flexibility in what the task can do, but it also means that the task provider is responsible for any process management and output parsing that needs to happen. The task provider is also responsible for implementing `Pseudoterminal` and returning it from the `CustomExecution` callback.

TypeScript

```
return new vscode.Task(
  definition,
  vscode.TaskScope.Workspace,
  `${flavor} ${flags.join(' ')}`,
  CustomBuildTaskProvider.CustomBuildScriptType,
  new vscode.CustomExecution(
    async (): Promise<vscode.Pseudoterminal> => {
      // When the task is executed, this callback will run. Here, we setup for running the task.
      return new CustomBuildTaskTerminal(
        this.workspaceRoot,
        flavor,
        flags,
        () => this.sharedState,
        (state: string) => (this.sharedState = state)
      );
    }
  )
);

```

The full example, including the implementation of `Pseudoterminal` is at [https://github.com/microsoft/vscode-extension-samples/tree/main/task-provider-sample/src/customTaskProvider.ts](https://github.com/microsoft/vscode-extension-samples/tree/main/task-provider-sample/src/customTaskProvider.ts).

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)