import builtinModules from 'builtin-modules'
import { defineConfig } from 'rolldown/config'
import { esmExternalRequirePlugin } from 'rolldown/experimental'

export default defineConfig({
	input: 'src/index.ts',
	output: {
		file: 'dist/index.js',
		format: 'esm',
	},
	transform: {
		target: 'es2022',
	},
	plugins: [
		esmExternalRequirePlugin({
			external: builtinModules,
		}),
	],
})
