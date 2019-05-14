const path = require('path');

const { run } = require('./util');


function runJavaScriptTestsWithCoverage(dependencies) {
    const { fs, paths } = dependencies;

    const args = [
        `--reporter=lcov`,
        'mocha',
        `--reporter=mocha-junit-reporter`,
        paths.js.test.root
    ];

    run(dependencies, paths.js.test.nyc, args, { cwd: paths.root });

    fs.moveSync(path.join(paths.root, 'test-results.xml'), paths.js.test.resultJUnitFile);
};

function reportCoverage({ fs, paths, reportToCoveralls }) {
    const lcov = fs.readFileSync(paths.js.coverage.lcovOutputFile).toString();

    const result = reportToCoveralls(lcov);

    console.log(result);
};

module.exports = {
    runJavaScriptTestsWithCoverage,
    reportCoverage
};
