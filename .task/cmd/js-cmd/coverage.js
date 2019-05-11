const { compileLibrary } = require('../common/compile');
const { runJavaScriptTestsWithCoverage } = require('../common/coverage');


module.exports = {
    command: 'coverage',
    desc: 'Runs the JS tests and generates coverage information.',
    builder: {
        format: {
            desc: 'The coverage reporting format.',
            choices: ['text', 'lcov'],
            default: 'text'
        }
    },
    handlerFactory(dependencies) {
        return function handler({ format }) {
            const compileArgs = ['-g4', '-s', 'ENVIRONMENT=node', '-s', 'SINGLE_FILE=1'];

            compileLibrary(dependencies, compileArgs);

            runJavaScriptTestsWithCoverage(dependencies, format);
        };
    }
};
