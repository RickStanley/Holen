import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	input: 'src/holen.js',
	output: {
		file: 'dist/holen.js',
		format: 'umd',
		name: 'holen'
	},
	plugins: [
		nodeResolve({
			mainFields: ['main', 'jsnext']
		}),
		commonjs({
			include: ['node_modules/**', '**']
		})
	]
};