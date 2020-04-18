/**
 * draft.js
 * Andrea Tino - 2020
 */

const vscode = require("vscode");

const cli = require("@librars/cli");
const common = require("@librars/cli-common");

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

            // Create dir to host artifacts
            const pathToNewWSFolder = path.join(fspath, value);
            fs.mkdirSync(pathToNewWSFolder);
            if (!fs.existsSync(pathToNewWSFolder) || !fs.statSync(pathToNewWSFolder).isDirectory()) {
                vscode.window.showWarningMessage(`Could not create folder ${pathToNewWSFolder}`);
                return;
            }

            generateDraft(context, pathToNewWSFolder).then((artifactsFolder) => {
                // Move artifacts two levels up and remove the (then empty) container folder
                // Structure is: project-folder/librars-job-folder/template-folder
                common.filesystem.moveFiles(artifactsFolder, path.normalize(path.join(artifactsFolder, "..", "..")));
                // The librars-job-folder will not be deleted by the previous command
                common.filesystem.deleteDirectory(path.normalize(path.join(artifactsFolder, "..")));

                vscode.window.showInformationMessage("Your new project is ready, Visual Studio Code will restart now...");
                setTimeout(() => {
                    reopenWorkspace(pathToNewWSFolder, value);
                }, 2*1000);
            }).catch((err) => {
                vscode.window.showErrorMessage(`Error while drafting artifact: '${err}'`);
            });
        });
    });
}
exports.draft = draft;

async function generateDraft(context, dirpath) {
    // Fetch template list
    const templates = await cli.list(common.generateId(false), cli.configuration.tryFetchServerInfoFromDataDir());
    if (!templates || templates.length === 0) {
        vscode.window.showErrorMessage("Could not retrieve the template list");
        return;
    }

    // Ask which template
    const chosenTemplate = await vscode.window.showQuickPick(templates, {
        matchOnDescription: true,
        matchOnDetail: false,
        placeHolder: "Select the template to use",
        ignoreFocusOut: false,
        canPickMany: false
    });

    return await cli.draft(common.generateId(false), cli.configuration.tryFetchServerInfoFromDataDir(), chosenTemplate, dirpath);
}

function reopenWorkspace(path, wsname) {
    const uri = vscode.Uri.file(path);
    const wsfolders = vscode.workspace.workspaceFolders;
    const deleteCount = !wsfolders ? 0 : wsfolders.length;

    return vscode.workspace.updateWorkspaceFolders(0, deleteCount, {
        uri: uri,
        name: wsname
    });
}

module.exports = {
    draft
}
