const path = require('path');

module.exports = {
    command: 'build [args...]',
    desc: 'Builds the WebAssembly output.',
    handlerFactory(dependencies) {
        return function handler({ args }) {
            compileAllSources(dependencies, args);

            copyOutput(dependencies, args);
        };
    }
};

function run({ spawnSync }, executable, args = [], opts = {}) {
    const result = spawnSync(executable, args, opts);
    
    if (result.status != 0) {
        throw result;
    }
};

const extraExportedRuntimeMethods = [
    'ccall', 'cwrap', 'stringToUTF8', 'UTF8ToString', 'writeAsciiToMemory', 'writeArrayToMemory', 'lengthBytesUTF8'
].map(f => `"${f}"`).join(',');

const exportedFunctions = [
    '_malloc', '_free'
].map(f => `"${f}"`).join(',');

function compileAllSources({ klawSync, paths, spawnSync }, extraArguments = []) {
    const cryptidSourceFiles = walkDirectory(klawSync, paths.dependencies.native.cryptid.sourceDir,
        paths.dependencies.native.cryptid.sourceExtension);
    const thirdPartySourceFiles = walkDirectory(klawSync, paths.dependencies.native.thirdParty.sourceDir,
        paths.dependencies.native.cryptid.sourceExtension);
    const interopSourceFiles = walkDirectory(klawSync, paths.interop.sourceDir,
        paths.interop.sourceExtension);
    const thirdPartyLibraries = [
        paths.dependencies.gmp.staticLibrary
    ];

    const opts = [
        ...cryptidSourceFiles,
        ...thirdPartySourceFiles,
        ...interopSourceFiles,
        ...thirdPartyLibraries,
        `-I${paths.dependencies.native.cryptid.includeDir}`,
        `-I${paths.dependencies.native.thirdParty.includeDir}`,
        `-I${paths.interop.includeDir}`,
        '-std=c99',
        '-Wall',
        '-Wextra',
        '-Werror',
        '--post-js', path.join(paths.wasm.root, 'post.js'),
        '-s', 'WASM=1',
        '-s', 'ALLOW_MEMORY_GROWTH=1',
        '-s', 'NO_EXIT_RUNTIME=0',
        '-s', `EXTRA_EXPORTED_RUNTIME_METHODS=[${extraExportedRuntimeMethods}]`,
        '-s', `EXPORTED_FUNCTIONS=[${exportedFunctions}]`,
        '-s', 'SINGLE_FILE=1',
        '-s', 'ENVIRONMENT=node',
        '-D__CRYPTID_EXTERN_RANDOM',
        '-O3',
        '--js-library', path.join(paths.wasm.root, 'random.js')
    ];

    opts.push(...extraArguments)

    compile({ spawnSync, paths }, opts);
};

function copyOutput({ fs, paths }) {
    if (fs.existsSync(paths.wasm.defaultOutput.js)) {
        fs.copyFileSync(paths.wasm.defaultOutput.js, paths.wasm.targetOutput.js);
        fs.unlinkSync(paths.wasm.defaultOutput.js)
    }
    
    if (fs.existsSync(paths.wasm.defaultOutput.wasm)) {
        fs.copyFileSync(paths.wasm.defaultOutput.wasm, paths.wasm.targetOutput.wasm);
        fs.unlinkSync(paths.wasm.defaultOutput.wasm)
    }
}

function compile(dependencies, opts) {
    run(dependencies, 'emcc', opts, { cwd: dependencies.paths.root });
};

function walkDirectory(klawSync, baseDirectory, extension) {
    return klawSync(baseDirectory, { nodir: true })
        .map(p => p.path)
        .filter(p => p.endsWith(extension))
};
