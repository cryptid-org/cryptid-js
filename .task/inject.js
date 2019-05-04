const path = require('path');

const paths = (function setupPaths() {
    const root = path.resolve(__dirname, '..');

    const nativeRoot = path.join(root, 'dependencies', 'cryptid-native')
    const native = {
        root: nativeRoot,
        cryptid: {
            sourceDir: path.join(nativeRoot, 'src'),
            sourceExtension: '.c',
            includeDir: path.join(nativeRoot, 'include')
        },
        thirdParty: {
            sourceDir: path.join(nativeRoot, 'third-party', 'src'),
            includeDir: path.join(nativeRoot, 'third-party', 'include')
        },
        test: {
            sourceDir: path.join(root, 'test', 'src'),
            sourceExtension: '.test.c',
            output(component) {
                return `${component}.out`;
            }
        }
    };
    native.test.componentSourceFile = function componentSourceFile(componentName) {
        return path.join(test.sourceDir, `${componentName}.test.c`);
    };
    const gmp = {
        staticLibrary: path.join(root, 'dependencies', 'gmp', 'libgmp.a')
    };
    const dependencies = {
        native,
        gmp
    };

    const wasmRoot = path.join(root, 'src', 'wasm');
    const wasm = {
        root: wasmRoot,
        defaultOutput: {
            js: path.join(root, 'a.out.js'),
            wasm: path.join(root, 'a.out.wasm')
        },
        targetOutput: {
            js: path.join(wasmRoot, 'cryptid-wasm.js'),
            wasm: path.join(wasmRoot, 'cryptid-wasm.wasm')
        }
    };

    const interopRoot = path.join(root, 'src', 'native-interop');
    const interop = {
        sourceDir: path.join(interopRoot, 'src'),
        sourceExtension: '.c',
        includeDir: path.join(interopRoot, 'include'),
    };

    return {
        root,
        dependencies,
        wasm,
        interop
    };
})();

module.exports = function inject() {
    return {
        paths
    };
};
