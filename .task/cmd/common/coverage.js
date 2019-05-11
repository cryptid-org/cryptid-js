const { run } = require('./util');

function runJavaScriptTestsWithCoverage(dependencies, format) {
    const { paths } = dependencies;

    run(dependencies, paths.js.test.nyc, [`--reporter=${format}`, 'mocha', paths.js.test.root], { cwd: paths.root });
}

module.exports = {
    runJavaScriptTestsWithCoverage
};
