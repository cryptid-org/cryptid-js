const { compileLibrary } = require('../common/compile');


module.exports = {
    command: 'build',
    desc: 'Builds the WebAssembly output.',
    builder: {
        debug: {
            description: 'Create a debug build.',
            type: 'boolean'
        },
        node: {
            description: 'Create an output specialized for Node.js. Implies singleFile.',
            type: 'boolean'
        },
        profiling: {
            description: 'Produce profiling-friendly output.',
            type: 'boolean'
        },
        singleFile: {
            description: 'Embed the WASM binary in the JS file in base64 format.',
            type: 'boolean'
        }
    },
    handlerFactory(dependencies) {
        return function handler({ debug, node, profiling, singleFile }) {
            const args = [];

            if (debug) {
                args.push('-g4');
            } else {
                args.push('-O3');
            }
            
            if (node) {
                args.push('-s', 'ENVIRONMENT=node');
                args.push('-s', 'SINGLE_FILE=1');
            }

            if (singleFile) {
                args.push('-s', 'SINGLE_FILE=1');
            }

            if (profiling) {
                args.push('--profiling-funcs');
            }

            compileLibrary(dependencies, args);
        };
    }
};
