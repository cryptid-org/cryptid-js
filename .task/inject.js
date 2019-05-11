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
            sourceDir: path.join(nativeRoot, 'test', 'src'),
            sourceExtension: '.test.c',
        }
    };
    native.test.componentSourceFile = function componentSourceFile(componentName) {
        return path.join(native.test.sourceDir, `${componentName}.test.c`);
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
        output: {
            js: path.join(wasmRoot, 'cryptid-wasm.js'),
        },
        test: {
            output(componentName) {
                return path.join(paths.root, `${componentName}-test-out.js`)
            }
        }
    };

    const interopRoot = path.join(root, 'src', 'native-interop');
    const interop = {
        sourceDir: path.join(interopRoot, 'src'),
        sourceExtension: '.c',
        includeDir: path.join(interopRoot, 'include'),
    };

    const js = {
        source: {
            root: path.join(root, 'src', 'js')
        },
        test: {
            root: path.join(root, 'test', '**', '*.test.js'),
            mocha: path.join(root, 'node_modules', '.bin', 'mocha'),
            nyc: path.join(root, 'node_modules', '.bin', 'nyc')
        }
    };

    const libRoot = path.join(root, 'lib');
    const lib = {
        root: libRoot,
        node: path.join(libRoot, 'node'),
        browser: path.join(libRoot, 'browser'),
        rollup: path.join(root, 'node_modules', '.bin', 'rollup')
    };

    return {
        root,
        dependencies,
        wasm,
        interop,
        js,
        lib
    };
})();

module.exports = function inject() {
    return {
        paths
    };
};
