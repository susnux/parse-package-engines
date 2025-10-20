/*!
 * SPDX-FileCopyrightText: 2025 Ferdinand Thiessen
 * SPDX-License-Identifier: MIT
 */

import { recommendedLibrary } from '@nextcloud/eslint-config'
import globals from 'globals'

export default [
	{
		ignores: ['**/coverage', '**/dist', '**/linter', '**/node_modules'],
	},
	...recommendedLibrary,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
				Atomics: 'readonly',
				SharedArrayBuffer: 'readonly',
			},

			ecmaVersion: 2023,
			sourceType: 'module',
		},
	},
]
