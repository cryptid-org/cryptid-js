const path = require('path');

module.exports = {
    command: 'wasm <command>',
    desc: 'WebAssembly related commands.',
    builder(subcommand) {
        return subcommand(path.join(__dirname, 'wasm-cmd'));
    },
    handler() { }
};