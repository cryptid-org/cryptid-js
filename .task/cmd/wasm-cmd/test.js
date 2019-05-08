const { runTests } = require('../common/test');
const { discoverAllNativeComponents } = require('../common/util');


module.exports = {
    command: 'test [components...]',
    desc: 'Runs the tests of the specified components (separated by spaces). If no components are set, all of them will be tested.',
    handlerFactory(dependencies) {
        return function handler({ components = discoverAllNativeComponents(dependencies) }) {
            runTests(dependencies, components);
        };
    }
};
