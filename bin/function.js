const Spinner = require('cli-spinner').Spinner;

module.exports = {
    log: console.log,
    showLoadingWithText: (processText) => {
        const spinner = new Spinner(`${processText}%s`);
        spinner.setSpinnerString(18);
        spinner.start();
        return spinner;
    },
    validPath: path => {
        return /(\/([a-zA-Z0-9-_]*))+$/.test(path);
    }
};