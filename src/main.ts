/*!
 * SPDX-FileCopyrightText: 2025 Ferdinand Thiessen
 * SPDX-License-Identifier: MIT
 */

import * as core from '@actions/core'
import { resolve } from 'node:path'

interface PackageJsonStub {
	devEngines?: {
		runtime: Array<{ name: string, version?: string }> | { name: string, version?: string }
		packageManager: Array<{ name: string, version?: string }> | { name: string, version?: string }
	}
	engines?: {
		node?: string
		npm?: string
	}
	packageManager?: string
}

/**
 * Get the package manager name and version from the package.json file as well as the Node.js version.
 */
export async function run() {
	try {
		const workingDirectory = core.getInput('working-directory', { required: false }) || process.env.GITHUB_WORKSPACE!
		const path = resolve(workingDirectory, core.getInput('path') || './package.json')

		if (!path.startsWith(workingDirectory)) {
			core.setFailed('The provided path is outside of the working directory.')
			return
		}

		core.debug(`Trying to read package.json at: ${path}`)
		const { default: packageJson } = await import(path, { with: { type: 'json' } })
		core.debug('Successfully read package.json. Starting to parse engines...')

		core.setOutput('node-version', getNodeVersion(packageJson) ?? '')

		const { name, version } = getPackageManagerInfo(packageJson)
		core.setOutput('package-manager-name', name ?? '')
		core.setOutput('package-manager-version', version ?? '')
	} catch (error) {
		// Fail the workflow run if an error occurs
		if (error instanceof Error) {
			core.setFailed(error.message)
		}
	}
}

/**
 * Get the Node.js version specified in the package.json file.
 *
 * @param packageJson - The package.json object
 * @param packageJson.devEngines - The devEngines field in package.json
 * @param packageJson.engines - The engines field in package.json
 */
export function getNodeVersion({ devEngines, engines }: PackageJsonStub): string | undefined {
	if (devEngines?.runtime) {
		const version = [devEngines.runtime].flat().find((r) => r.name && r.name.toLowerCase() === 'node' && r.version)
		if (version) {
			core.debug('Found devEngines entry for Node.js')
			return version.version
		}
	}

	if (engines?.node) {
		core.debug('Falling back to engines entry for Node.js')
		return engines.node
	}

	core.debug('Neither devEngines nor engines entry for Node.js found')
	core.debug(JSON.stringify({ devEngines, engines }))
	return undefined
}

/**
 * Get the Node.js version specified in the package.json file.
 *
 * @param packageJson - The package.json object
 */
export function getPackageManagerInfo(packageJson: PackageJsonStub): { name?: string, version?: string } {
	if (packageJson.devEngines?.packageManager) {
		const entry = [packageJson.devEngines.packageManager].flat().find((r) => r.name && r.version)
		if (entry) {
			core.debug('Found devEngines entry for the package manager')
			return entry
		}
	}

	if (packageJson.engines?.npm) {
		core.debug('Falling back to engines entry for npm')
		return { name: 'npm', version: packageJson.engines.npm }
	}

	if (packageJson.packageManager) {
		core.debug('Falling back to packageManager entry')
		const [name, version] = packageJson.packageManager.split('@')
		return { name, version }
	}

	return {}
}
