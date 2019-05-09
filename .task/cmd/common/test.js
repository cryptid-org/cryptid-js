const { compileTestExecutableForComponent } = require('./compile');
const { removeFiles, run } = require('./util');

function runTests(dependencies, components) {
    const errors = testComponents(dependencies, components);

    if (errors.length > 0) {
        console.log(errors);
        throw new Error('There were errors running the tests. Please see the log lines above.');
    }
};

function testComponents(dependencies, components) {
    const errors = [];

    for (const component of components) {
        console.log(`Testing ${component}`);

        const testOutput = compileTestExecutableForComponent(component, dependencies, []);

        try {
            run(dependencies, 'node', [testOutput, '-v']);
        } catch (e) {
            errors.push({
                component,
                error: e
            });
        } finally {
            removeFiles(dependencies, ['*test-out*']);
        }

        console.log('\n');
    }

    return errors;
};

function runJavaScriptTests(dependencies) {
    const { paths } = dependencies;

    run(dependencies, paths.js.test.mocha, [paths.js.test.root], { cwd: paths.root });            
}

module.exports = {
    runTests,
    runJavaScriptTests
};
