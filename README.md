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

## Usage
