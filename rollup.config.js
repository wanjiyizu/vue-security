import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
    entry: 'src/index.js',
    dest: 'dist/vue-security.js',
    format: 'umd',
    moduleName: 'VueSecurity',
    plugins: [
        resolve({ jsnext: true, main: true }),
        commonjs(),
        babel({
            exclude: 'node_modules/**'
        })
    ]
};