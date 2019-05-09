const path = require('path');

module.exports = {
    command: 'js <command>',
    desc: 'JavaScript related commands.',
    builder(subcommand) {
        return subcommand(path.join(__dirname, 'js-cmd'));
    },
    handler() { }
};