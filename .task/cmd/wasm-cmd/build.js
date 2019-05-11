const { compileLibrary } = require('../common/compile');


module.exports = {
    command: 'build',
    desc: 'Builds the WebAssembly output.',
    builder: {
        debug: {
            description: 'Create a debug build.',
            type: 'boolean'
        },
        environment: {
            description: 'The target environment. Note that node implies single file.',
            choices: ['browser', 'node']
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
        return function handler({ environment, debug, profiling, singleFile }) {
            const args = [];

            if (debug) {
                args.push('-g4');
            } else {
                args.push('-O3');
            }

            if (singleFile) {
                args.push('-s', 'SINGLE_FILE=1');
            }

            if (profiling) {
                args.push('--profiling-funcs');
            }

            compileLibrary(dependencies, environment, args);
        };
    }
};
