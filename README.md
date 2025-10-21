# parse-package-engines

<!--
 - SPDX-FileCopyrightText: 2025 Ferdinand Thiessen
 - SPDX-License-Identifier: MIT
-->

![CI](https://github.com/actions/javascript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/javascript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/javascript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/javascript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/javascript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This is a GitHub action to parse the node version and the package manager (name and version) from a `package.json`.
The idea is that with the `setup-node` action currently `devEngines` is not supported, but it also does not to setup a specific package manager.

So this action is capable of parsing `engines`, `devEngines` as well as `packageManager` entries from a `package.json`.

## Inputs & Outputs

Inputs:
* `path`: The path to the `package.json` relative to `working-directory`, defaults to `./package.json`
* `working-directory`: The current working directory - used for reading the `package.json` and defaults to the `GITHUB_WORKSPACE`.

Outputs:
* `node-version`: The detected Node.js version
* `package-manager-name`: The name of the detected package manager, like `npm` or `yarn`
* `package-manager-version`: The version of the detected package manager, like `^10.5.1`

## Usage

When for example building a workflow to compile assets the usage could look like this:

```yaml
name: Node build
on: pull_request

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    name: NPM build
    steps:
      - name: Checkout
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0
        with:
          persist-credentials: false

      - name: Read package.json
        uses: nextcloud-libraries/parse-package-engines-action@main # please pin this version to an actual tag for security
        id: versions

      - name: Set up node ${{ steps.versions.outputs.node-version }}
        uses: actions/setup-node@a0853c24544627f65ddf259abe73b1d18a591444 # v5.0.0
        with:
          node-version: ${{ steps.versions.outputs.node-version }}

      # Here we know we use npm
      - name: Set up npm ${{ steps.versions.outputs.package-manager-version }}
        run: npm i -g 'npm@${{ steps.versions.outputs.package-manager-version }}'

      - name: Install dependencies & build
        run: |
          npm ci
          npm run build --if-present
```
