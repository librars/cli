/**
 * compile.js
 * Andrea Tino - 2020
 */

const vscode = require("vscode");

function compile(context) {
    vscode.window.showInformationMessage("Compile is on the way");
}
exports.compile = compile;

module.exports = {
    compile
}
