/**
 * help.js
 * Andrea Tino - 2020
 */

const vscode = require("vscode");

const path = require("path");

/**
 * Performs the help command.
 * 
 * @param {*} context The comtext.
 */
function help(context) {
    vscode.workspace.openTextDocument(getResFilePath("help.md", context)).then((doc) => {
        vscode.window.showTextDocument(doc);
    });
}
exports.help = help;

function getResFilePath(file, context, webView) {
    const localPath = path.join("res", file);

    if (webView) {
        return webView.asWebviewUri(vscode.Uri.file(context.asAbsolutePath(localPath))).toString();
    }

    return context.asAbsolutePath(localPath);
}

module.exports = {
    help
}
