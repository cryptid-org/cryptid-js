const { compileLibrary } = require('../common/compile');
const { runJavaScriptTestsWithCoverage } = require('../common/coverage');


module.exports = {
    command: 'coverage',
    desc: 'Runs the JS tests and generates coverage information.',
    handlerFactory(dependencies) {
        return function handler() {
            const compileArgs = ['-g4'];

            compileLibrary(dependencies, 'node', compileArgs);

            runJavaScriptTestsWithCoverage(dependencies);
        };
    }
};
