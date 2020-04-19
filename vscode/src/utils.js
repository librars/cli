/**
 * utils.js
 * Andrea Tino - 2020
 */

const vscode = require("vscode");

const common = require("@librars/cli-common");

const path = require("path");
const fs = require("fs");

const consts = require("./consts").consts;

/**
 * Copies the current workspace.
 * 
 * @param {string} dstdir The path to the directory (must exist) where to copy the current workspace.
 */
function copyWS(dstdir) {
    common.filesystem.copyFiles(getWSFolderPath(), dstdir, (f) => {
        // Exclude the out folder
        if (fs.statSync(f).isDirectory) {
            if (path.basename(f).toLowerCase() === consts.OUT_FOLDER) {
                return false;
            }
        }
        return true;
    });
}

/**
 * Gets the current workspace folder path.
 * 
 * @returns {string} The path to the current workspace.
 */
function getWSFolderPath() {
    return (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0)
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : null;
}

/**
 * Generates a new operation id.
 * 
 * @returns {string} The new id.
 */
function newOpid() {
    return common.generateId(false);
}

/**
 * Ensures the out folder in the workspace is created.
 * 
 * @returns {string} The (normalized) path to the out folder.
 */
function ensureOutFolder() {
    const wsdir = getWSFolderPath();
    const outDir = path.join(wsdir, consts.OUT_FOLDER);

    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
    }

    return path.normalize(outDir);
}

/**
 * Copies only artifact files (PDF, HTML).
 * 
 * @param {string} srcDir Where to copy from.
 * @param {string} dstDir Where to copy to.
 */
function copyArtifacts(srcDir, dstDir) {
    // Depth first recursive copy
    const copy = (d, nd, cond) => {
        if (fs.existsSync(d)) {
            fs.readdirSync(d).forEach((file, index) => {
                const curPath = path.join(d, file);
                const npath = path.join(nd, path.basename(curPath));
                if (fs.lstatSync(curPath).isFile() && cond(curPath)) {
                    fs.copyFileSync(curPath, npath, fs.constants.COPYFILE_EXCL);
                }
            });
        }
    };

    copy(srcDir, dstDir, (filePath) => {
        const ext = path.extname(filePath);
        if (!ext) {
            return false;
        }
        return ext.toLowerCase().indexOf("pdf") >= 0;
    });
}

module.exports = {
    copyWS,
    getWSFolderPath,
    newOpid,
    ensureOutFolder,
    copyArtifacts
}
