/*!
 * SPDX-FileCopyrightText: 2025 Ferdinand Thiessen
 * SPDX-License-Identifier: MIT
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getNodeVersion, getPackageManagerInfo } from './main.ts'

const core = vi.hoisted(() => ({
	getInput: vi.fn(),
	setOutput: vi.fn(),
	setFailed: vi.fn(),
	debug: vi.fn(),
}))
vi.mock('@actions/core', () => core)

beforeEach(() => {
	vi.resetAllMocks()
})

describe('getNodeVersion', () => {
	it('should return node version from devEngines object', async () => {
		const packageJson = {
			devEngines: {
				runtime: { name: 'node', version: '>=24.0.0' },
			},
		}

		expect(getNodeVersion(packageJson)).toBe('>=24.0.0')
	})

	it('should return node version from devEngines array', async () => {
		const packageJson = {
			devEngines: {
				runtime: [
					{ name: 'node', version: '>=24.0.0' },
					{ name: 'bun', version: '>=1.0.0' },
				],
			},
		}

		expect(getNodeVersion(packageJson)).toBe('>=24.0.0')
	})

	it('should return node version from devEngines array with casing', async () => {
		const packageJson = {
			devEngines: {
				runtime: [
					{ name: 'bun', version: '>=1.0.0' },
					{ name: 'Node', version: '>=24.0.0' },
				],
			},
		}

		expect(getNodeVersion(packageJson)).toBe('>=24.0.0')
	})

	it('should fallback to engines', async () => {
		const packageJson = {
			devEngines: {
				runtime: { version: '>=1.0.0' },
			},
			engines: {
				node: '>=24.0.0',
			},
		}

		expect(getNodeVersion(packageJson)).toBe('>=24.0.0')
	})

	it('should return undefined if nothing is provided', async () => {
		const packageJson = {}

		expect(getNodeVersion(packageJson)).toBeUndefined()
	})
})

describe('getPackageManagerInfo', () => {
	it('should return package manager from devEngines object', async () => {
		const packageJson = {
			devEngines: {
				packageManager: { name: 'npm', version: '^11.0.0' },
			},
		}
		expect(getPackageManagerInfo(packageJson)).toEqual({ name: 'npm', version: '^11.0.0' })
	})

	it('should return node version from devEngines array', async () => {
		const packageJson = {
			devEngines: {
				packageManager: [
					{ name: 'npm' },
					{ name: 'yarn', version: '>=2.0.0' },
				],
			},
		}

		expect(getPackageManagerInfo(packageJson)).toEqual({ name: 'yarn', version: '>=2.0.0' })
	})

	it('should fallback to engines', async () => {
		const packageJson = {
			devEngines: {
				packageManager: { name: 'npm' },
			},
			engines: {
				npm: '>=10.5.0',
			},
		}

		expect(getPackageManagerInfo(packageJson)).toEqual({ name: 'npm', version: '>=10.5.0' })
	})

	it('should fallback to packageManager', async () => {
		const packageJson = {
			devEngines: {
				packageManager: { name: 'npm' },
			},
			engines: {
				node: '>=22.0.0',
			},
			packageManager: 'npm@^10.5.0',
		}

		expect(getPackageManagerInfo(packageJson)).toEqual({ name: 'npm', version: '^10.5.0' })
	})

	it('should return undefined if nothing is provided', async () => {
		const packageJson = {}

		expect(getPackageManagerInfo(packageJson)).toEqual({})
	})
})
