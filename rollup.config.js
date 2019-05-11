const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');

const pkg = require('./package.json');


module.exports = [
    {
        input: 'src/js/index.js',
        output: [{
            name: 'CryptID',
            file: pkg.browser,
            format: 'umd',
            exports: 'named'
        }],
        plugins: [
            resolve(),
            commonjs(),
            terser()
        ]
    }
];
