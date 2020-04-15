/**
 * draft.js
 * Andrea Tino - 2020
 */

const vscode = require("vscode");

const path = require("path");
const fs = require("fs");

/**
 * Drafts a new artifact.
 * 
 * @param {*} context The comtext.
 */
function draft(context) {
    vscode.window.showOpenDialog({
        openLabel: "Save here",
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false
    }).then((dirpaths) => {
        // Parameter value contains the array Uri being selected
        const dirpath = (dirpaths && dirpaths.length > 0) ? dirpaths[0] : null;
        if (!dirpath) {
            return;
        }

        vscode.window.showInputBox({
            value: "My new artifact",
            prompt: "Type your new artifact's name",
            ignoreFocusOut: false,
            validateInput: (v) => {
                return v.indexOf("!") >= 0 ? "Name can contain only numbers, letters and spaces" : null; // Null means: 'ok'
            }
        }).then((value) => {
            if (!value) {
                return;
            }

            const fspath = dirpath.fsPath;
            if (!fs.existsSync(fspath) || !fs.statSync(fspath).isDirectory()) {
                return;
            }

            const pathToNewWSFolder = path.join(fspath, value);
            fs.mkdirSync(pathToNewWSFolder);
            if (!fs.existsSync(pathToNewWSFolder) || !fs.statSync(pathToNewWSFolder).isDirectory()) {
                vscode.window.showWarningMessage(`Could not create folder ${pathToNewWSFolder}`);
                return;
            }

            reopenWorkspace(pathToNewWSFolder, value);
        });
    });
}
exports.draft = draft;

function reopenWorkspace(path, wsname) {
    const uri = vscode.Uri.file(path);
    const wsfolders = vscode.workspace.workspaceFolders;
    const deleteCount = !wsfolders ? 0 : wsfolders.length;

    vscode.workspace.updateWorkspaceFolders(0, deleteCount, {
        uri: uri,
        name: wsname
    });
}

module.exports = {
    draft
}
