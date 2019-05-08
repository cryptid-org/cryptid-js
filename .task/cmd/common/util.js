const path = require('path');


function discoverAllComponents({ fg, paths }) {
    const names = fg.sync([`**/*${paths.test.sourceExtension}`], { cwd: paths.root })
        .map(p => path.basename(p, paths.test.sourceExtension));
    
    console.log(`Discovered ${names.length} components: ${names.join(' ')}`);

    return names;
};

function removeFiles({ paths, fg, fs }, globs) {
    console.log(`Removing files using globs: ${globs.join(', ')}`);

    const options = {
        absolute: true,
        cwd: paths.root
    };

    const files = fg.sync(globs, options);

    console.log(`\t${files.length} file(s) matched`);

    files
        .forEach(file => fs.unlinkSync(file));
};

function run({ spawnSync }, executable, args = [], opts = {}) {
    const result = spawnSync(executable, args, opts);
    
    if (result.status != 0) {
        throw result;
    }
};

function walkDirectory(klawSync, baseDirectory, extension) {
    return klawSync(baseDirectory, { nodir: true })
        .map(p => p.path)
        .filter(p => p.endsWith(extension))
};

function moveFile({ fs }, source, destination) {
    if (fs.existsSync(source)) {
        fs.copyFileSync(source, destination);
        fs.unlinkSync(source)
    }
}

module.exports = {
    discoverAllComponents,
    removeFiles,
    run,
    walkDirectory,
    moveFile
};
