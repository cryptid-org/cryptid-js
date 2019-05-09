const { compileLibrary } = require('../common/compile');
const { runJavaScriptTests } = require('../common/test');


module.exports = {
    command: 'test',
    desc: 'Runs the JS tests.',
    handlerFactory(dependencies) {
        return function handler() {
            const compileArgs = ['-g4', '-s', 'ENVIRONMENT=node', '-s', 'SINGLE_FILE=1'];

            compileLibrary(dependencies, compileArgs);

            runJavaScriptTests(dependencies);
        };
    }
};
