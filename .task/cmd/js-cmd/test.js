const { compileLibrary } = require('../common/compile');
const { runJavaScriptTests } = require('../common/test');


module.exports = {
    command: 'test',
    desc: 'Runs the JS tests.',
    handlerFactory(dependencies) {
        return function handler() {
            const compileArgs = ['-g4'];

            compileLibrary(dependencies, 'node', compileArgs);

            runJavaScriptTests(dependencies);
        };
    }
};
