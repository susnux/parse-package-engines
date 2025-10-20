/*!
 * SPDX-FileCopyrightText: 2025 Ferdinand Thiessen
 * SPDX-License-Identifier: MIT
 */

import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'node',
		coverage: {
			reporter: ['text', 'json'],
		},
	},
})
