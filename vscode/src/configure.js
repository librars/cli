/**
 * configuration.js
 * Andrea Tino - 2020
 */

const vscode = require("vscode");

const cli = require("@librars/cli");

const path = require("path");

/**
 * Performs the configure command.
 * 
 * @param {*} context The comtext.
 */
function configure(context) {
    const configFilePath = cli.configuration.getConfigFilePath();
    if (!configFilePath) {
        vscode.window.showErrorMessage("Could not retrieve configuration file path");
        return;
    }

    vscode.workspace.openTextDocument(configFilePath).then((doc) => {
        vscode.window.showTextDocument(doc);

        vscode.window.showInformationMessage("Edit this file and save it. Then run the 'Test connection' command to check your configuration works.");
    });
}
exports.configure = configure;

module.exports = {
    configure
}
