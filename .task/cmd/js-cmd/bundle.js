const path = require('path');

const { compileLibrary } = require('../common/compile');
const { run } = require('../common/util');


function bundleBrowser(dependencies) {
    const compileArgs = ['-O3', '-s', 'SINGLE_FILE=1'];

    compileLibrary(dependencies, 'browser', compileArgs);

    const { paths } = dependencies;

    run(dependencies, paths.lib.rollup, ['-c'], { cwd: paths.root });
};

function bundleNode(dependencies) {
    const compileArgs = ['-O3'];

    compileLibrary(dependencies, 'node', compileArgs);

    const { fs, paths } = dependencies;

    fs.ensureDirSync(path.join(paths.lib.node, 'js'));
    fs.ensureDirSync(path.join(paths.lib.node, 'wasm'));

    fs.copySync(path.join(paths.js.source.root), path.join(paths.lib.node, 'js'));
    fs.copySync(paths.wasm.output.js, path.join(paths.lib.node, 'wasm', 'cryptid-wasm.js'));
};

module.exports = {
    command: 'bundle',
    desc: 'Bundles the library into a single file.',
    builder: {
        environment: {
            desc: 'The environment in which the bundle is going to be consumed.',
            choices: ['browser', 'node']
        }
    },
    handlerFactory(dependencies) {
        return function handler({ environment }) {
            if (environment == 'browser') {
                bundleBrowser(dependencies);
            } else if (environment == 'node') {
                bundleNode(dependencies);
            }
        };
    }
};
