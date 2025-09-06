Join a [VS Code Dev Days event](https://code.visualstudio.com/dev-days) near you to learn about AI-assisted development in VS Code.

Dismiss this update

[Edit](https://vscode.dev/github/microsoft/vscode-docs/blob/main/api/working-with-extensions/continuous-integration.md "Edit this document in vscode.dev")

# Continuous Integration

Extension integration tests can be run on CI services. The [`@vscode/test-electron`](https://github.com/microsoft/vscode-test) library helps you set up extension tests on CI providers and contains a [sample extension](https://github.com/microsoft/vscode-test/tree/main/sample) setup on Azure Pipelines. You can check out the [build pipeline](https://dev.azure.com/vscode/vscode-test/_build?definitionId=15) or jump directly to the [`azure-pipelines.yml` file](https://github.com/microsoft/vscode-test/blob/main/sample/azure-pipelines.yml).

## [Automated publishing](https://code.visualstudio.com/api/working-with-extensions/continuous-integration\#automated-publishing)

You can also configure the CI to publish a new version of the extension automatically.

The publish command is similar to publishing from a local environment using [`vsce`](https://github.com/microsoft/vscode-vsce), but you must somehow provide the Personal Access Token (PAT) in a secure way. By storing the PAT as a `VSCE_PAT` **secret variable**, `vsce` will be able to use it. Secret variables are never exposed, so they are safe to use in a CI pipeline.

## [Azure Pipelines](https://code.visualstudio.com/api/working-with-extensions/continuous-integration\#azure-pipelines)

[![Azure Pipelines](https://code.visualstudio.com/assets/api/working-with-extensions/continuous-integration/pipelines-logo.png)](https://azure.microsoft.com/services/devops/)

[Azure Pipelines](https://azure.microsoft.com/services/devops/pipelines/) is great for running VS Code extension tests as it supports running the tests on Windows, macOS, and Linux. For Open Source projects, you get unlimited minutes and 10 free parallel jobs. This section explains how to set up an Azure Pipelines for running your extension tests.

First, create a free account on [Azure DevOps](https://azure.microsoft.com/services/devops/) and create an [Azure DevOps project](https://azure.microsoft.com/features/devops-projects/) for your extension.

Then, add the following `azure-pipelines.yml` file to the root of your extension's repository. Other than the `xvfb` setup script for Linux that is necessary to run VS Code in headless Linux CI machines, the definition is straight-forward:

YAML

```
trigger:
  branches:
    include:
    - main
  tags:
    include:
    - v*

strategy:
  matrix:
    linux:
      imageName: 'ubuntu-latest'
    mac:
      imageName: 'macos-latest'
    windows:
      imageName: 'windows-latest'

pool:
  vmImage: $(imageName)

steps:

- task: NodeTool@0
  inputs:
    versionSpec: '10.x'
  displayName: 'Install Node.js'

- bash: |
    /usr/bin/Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
    echo ">>> Started xvfb"
  displayName: Start xvfb
  condition: and(succeeded(), eq(variables['Agent.OS'], 'Linux'))

- bash: |
    echo ">>> Compile vscode-test"
    yarn && yarn compile
    echo ">>> Compiled vscode-test"
    cd sample
    echo ">>> Run sample integration test"
    yarn && yarn compile && yarn test
  displayName: Run Tests
  env:
    DISPLAY: ':99.0'

```

Finally, [create a new pipeline](https://learn.microsoft.com/azure/devops/pipelines/create-first-pipeline) in your DevOps project and point it to the `azure-pipelines.yml` file. Trigger a build and voilà:

![pipelines](https://code.visualstudio.com/assets/api/working-with-extensions/continuous-integration/pipelines.png)

You can enable the build to run continuously when pushing to a branch and even on pull requests. See [Build pipeline triggers](https://learn.microsoft.com/azure/devops/pipelines/build/triggers) to learn more.

### [Azure Pipelines automated publishing](https://code.visualstudio.com/api/working-with-extensions/continuous-integration\#azure-pipelines-automated-publishing)

1. Set up `VSCE_PAT` as a secret variable using the [Azure DevOps secrets instructions](https://learn.microsoft.com/azure/devops/pipelines/process/variables?tabs=classic%2Cbatch#secret-variables).
2. Install `vsce` as a `devDependencies` ( `npm install @vscode/vsce --save-dev` or `yarn add @vscode/vsce --dev`).
3. Declare a `deploy` script in `package.json` without the PAT (by default, `vsce` will use the `VSCE_PAT` environment variable as the Personal Access Token).

JSON

```
"scripts": {
  "deploy": "vsce publish --yarn"
}

```

4. Configure the CI so the build will also run when tags are created:

YAML

```
trigger:
  branches:
    include:
    - main
  tags:
    include:
    - refs/tags/v*

```

5. Add a `publish` step in `azure-pipelines.yml` that calls `yarn deploy` with the secret variable.

YAML

```
- bash: |
    echo ">>> Publish"
    yarn deploy
  displayName: Publish
  condition: and(succeeded(), startsWith(variables['Build.SourceBranch'], 'refs/tags/'), eq(variables['Agent.OS'], 'Linux'))
  env:
    VSCE_PAT: $(VSCE_PAT)

```

The [condition](https://learn.microsoft.com/azure/devops/pipelines/process/conditions) property tells the CI to run the publish step only in certain cases.

In our example, the condition has three checks:

- `succeeded()` \- Publish only if the tests pass.
- `startsWith(variables['Build.SourceBranch'], 'refs/tags/')` \- Publish only if a tagged (release) build.
- `eq(variables['Agent.OS'], 'Linux')` \- Include if your build runs on multiple agents (Windows, Linux, etc.). If not, remove that part of the condition.

Since `VSCE_PAT` is a secret variable, it is not immediately usable as an environment variable. Thus, we need to explicitly map the environment variable `VSCE_PAT` to the secret variable.

## [GitHub Actions](https://code.visualstudio.com/api/working-with-extensions/continuous-integration\#github-actions)

You can also configure GitHub Actions to run your extension CI. In headless Linux CI machines `xvfb` is required to run VS Code, so if Linux is the current OS run the tests in an Xvfb enabled environment:

YAML

```
on:
  push:
    branches:
      - main

jobs:
  build:
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    - name: Install Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 18.x
    - run: npm install
    - run: xvfb-run -a npm test
      if: runner.os == 'Linux'
    - run: npm test
      if: runner.os != 'Linux'

```

### [GitHub Actions automated publishing](https://code.visualstudio.com/api/working-with-extensions/continuous-integration\#github-actions-automated-publishing)

1. Set up `VSCE_PAT` as an encrypted secret using the [GitHub Actions secrets instructions](https://docs.github.com/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository).
2. Install `vsce` as a `devDependencies` ( `npm install @vscode/vsce --save-dev` or `yarn add @vscode/vsce --dev`).
3. Declare a `deploy` script in `package.json` without the PAT.

JSON

```
"scripts": {
  "deploy": "vsce publish --yarn"
}

```

4. Configure the CI so the build will also run when tags are created:

YAML

```
on:
  push:
    branches:
    - main
  release:
    types:
    - created

```

5. Add a `publish` job to the pipeline that calls `npm run deploy` with the secret variable.

YAML

```
- name: Publish
  if: success() && startsWith(github.ref, 'refs/tags/') && matrix.os == 'ubuntu-latest'
  run: npm run deploy
  env:
    VSCE_PAT: ${{ secrets.VSCE_PAT }}

```

The [if](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idif) property tells the CI to run the publish step only in certain cases.

In our example, the condition has three checks:

- `success()` \- Publish only if the tests pass.
- `startsWith(github.ref, 'refs/tags/')` \- Publish only if a tagged (release) build.
- `matrix.os == 'ubuntu-latest'` \- Include if your build runs on multiple agents (Windows, Linux, etc.). If not, remove that part of the condition.

## [GitLab CI](https://code.visualstudio.com/api/working-with-extensions/continuous-integration\#gitlab-ci)

GitLab CI can be used to test and publish the extension in headless Docker containers. This can be done by pulling a preconfigured Docker image, or installing `xvfb` and the libraries required to run Visual Studio Code during the pipeline.

YAML

```
image: node:12-buster

before_script:
  - npm install

test:
  script:
    - |
      apt update
      apt install -y libasound2 libgbm1 libgtk-3-0 libnss3 xvfb
      xvfb-run -a npm run test

```

### [GitLab CI automated publishing](https://code.visualstudio.com/api/working-with-extensions/continuous-integration\#gitlab-ci-automated-publishing)

1. Set up `VSCE_PAT` as a masked variable using the [GitLab CI documentation](https://docs.gitlab.com/ee/ci/variables/README.html#mask-a-cicd-variable).
2. Install `vsce` as a `devDependencies` ( `npm install @vscode/vsce --save-dev` or `yarn add @vscode/vsce --dev`).
3. Declare a `deploy` script in `package.json` without the PAT.

JSON

```
"scripts": {
  "deploy": "vsce publish --yarn"
}

```

4. Add a `deploy` job that calls `npm run deploy` with the masked variable which will only trigger on tags.

YAML

```
deploy:
  only:
    - tags
  script:
    - npm run deploy

```

## [Common questions](https://code.visualstudio.com/api/working-with-extensions/continuous-integration\#common-questions)

### [Do I need to use Yarn for continuous integration?](https://code.visualstudio.com/api/working-with-extensions/continuous-integration\#do-i-need-to-use-yarn-for-continuous-integration)

All of the above examples refer to a hypothetical project built with [Yarn](https://yarnpkg.com/), but can be adapted to use [npm](https://www.npmjs.com/), [Grunt](https://gruntjs.com/), [Gulp](https://gulpjs.com/), or any other JavaScript build tool.

08/07/2025

- [![RSS](https://code.visualstudio.com/assets/community/sidebar/rss.svg)RSS Feed](https://code.visualstudio.com/feed.xml)
- [![Stackoverflow](https://code.visualstudio.com/assets/community/sidebar/stackoverflow.svg)Ask questions](https://stackoverflow.com/questions/tagged/vscode)
- [![Twitter](https://code.visualstudio.com/assets/community/sidebar/twitter.svg)Follow @code](https://go.microsoft.com/fwlink/?LinkID=533687)
- [![GitHub](https://code.visualstudio.com/assets/community/sidebar/github.svg)Request features](https://go.microsoft.com/fwlink/?LinkID=533482)
- [![Issues](https://code.visualstudio.com/assets/community/sidebar/issue.svg)Report issues](https://www.github.com/Microsoft/vscode/issues)
- [![YouTube](https://code.visualstudio.com/assets/community/sidebar/youtube.svg)Watch videos](https://www.youtube.com/channel/UCs5Y5_7XK8HLDX0SLNwkd3w)