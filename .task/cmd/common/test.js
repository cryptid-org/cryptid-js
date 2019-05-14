const path = require('path');

const { compileTestExecutableForComponent } = require('./compile');
const { removeFiles, run } = require('./util');


const TEN_MEGABYTES = 10 * 1024 * 1024;

function runTests(dependencies, components) {
    try {
        const { output, errors } = testComponents(dependencies, components);

        if (errors.length > 0) {
            console.log(errors);
            throw new Error('There were errors running the tests. Please see the log lines above.');
        }

        console.log(errors);

        console.log('emitting');

        try {
            emitTestResults(dependencies, output);
        } catch (e) {
            console.log('ERR');
            console.log(e);
        }
    } finally {
        removeFiles(dependencies, ['*.o', '*.out']);
    }
};

function testComponents(dependencies, components) {
    const errors = [];
    const output = [];

    for (const component of components) {
        console.log(`Testing ${component}`);

        const testOutput = compileTestExecutableForComponent(component, dependencies, []);

        try {
            const { stdout } = run(dependencies, 'node', [testOutput, '-v'], {
                stdio: ['inherit', 'pipe', 'inherit'],
                maxBuffer: TEN_MEGABYTES
            });
            console.log('fasz');

            const stdoutString = stdout.toString();

            console.log(stdoutString);
            output.push({
                component,
                stdout: stdoutString
            });
        } catch (e) {
            errors.push({
                component,
                error: e
            });

            console.log(e);
            console.log('ERROR testing component:');
            console.log(e.error);
            console.log(e.error.message);
            console.log(e.stdout.toString());
        } finally {
            removeFiles(dependencies, ['*test-out*']);
        }

        console.log('\n');
    }

    return {
        output,
        errors
    };
};

function emitTestResults(dependencies, output) {
    const { fs, paths } = dependencies;

    fs.ensureDirSync(paths.wasm.test.resultsDirectory);

    output.forEach(singleOutput => writeOutputToXml(dependencies, singleOutput));
};

function writeOutputToXml(dependencies, { component, stdout }) {
    const tapOutput = tapifyGreatest(dependencies, stdout);

    const xmlOutput = xmlifyTap(dependencies, component, tapOutput);

    const { fs, paths } = dependencies;

    fs.writeFileSync(path.join(paths.wasm.test.resultsDirectory, `${component}.xml`), xmlOutput);
};

function tapifyGreatest({ paths, spawnSync }, input) {
    const result = run({ spawnSync }, 'gawk', ['-f', paths.wasm.test.tapify], {
        input,
        stdio: [],
        maxBuffer: TEN_MEGABYTES,
        cwd: paths.wasm.test.resultsDirectory 
    });

    return result.stdout.toString();
};

function xmlifyTap({ tapToJUnit }, component, input) {
    return tapToJUnit(input, component);
};

function runJavaScriptTests(dependencies) {
    const { paths } = dependencies;

    run(dependencies, paths.js.test.mocha, [paths.js.test.root], { cwd: paths.root });            
}

module.exports = {
    runTests,
    runJavaScriptTests
};
