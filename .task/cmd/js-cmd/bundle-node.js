const path = require('path');

const { compileLibrary } = require('../common/compile');


module.exports = {
    command: 'bundle-node',
    desc: 'Creates a bundle suitable for server-side use.',
    handlerFactory(dependencies) {
        return function handler() {
            const compileArgs = ['-O3'];

            compileLibrary(dependencies, 'node', compileArgs);

            const { fs, paths } = dependencies;

            fs.ensureDirSync(path.join(paths.lib.node, 'js'));
            fs.ensureDirSync(path.join(paths.lib.node, 'wasm'));

            fs.copySync(path.join(paths.js.source.root), path.join(paths.lib.node, 'js'));
            fs.copySync(paths.wasm.output.js, path.join(paths.lib.node, 'wasm', 'cryptid-wasm.js'));
        };
    }
};
