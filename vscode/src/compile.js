/**
 * compile.js
 * Andrea Tino - 2020
 */

const vscode = require("vscode");

const cli = require("@librars/cli");
const common = require("@librars/cli-common");

const path = require("path");
const fs = require("fs");

const consts = require("./consts").consts;
const utils = require("./utils");

// Configuration
const cleanAfter = true;

function compile(context) {
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Compiling artifact",
        cancellable: true
    }, (progress, token) => {
        return new Promise((resolve, reject) => {
            token.onCancellationRequested(() => {
                reject(`Cancelled`);
                return;
            });

            doCompile(context, progress).then(() => {
                vscode.window.showInformationMessage("Compilation completed!");
                resolve();
            }).catch((err) => {
                vscode.window.showErrorMessage(`Compilation failed: '${err}'`);
                reject(err);
            });
        });
    });
}
exports.compile = compile;

async function doCompile(context, progress) {
    progress.report({ increment: 0, message: "Copying artifacts..." });
    const wsfolder = utils.getWSFolderPath();

    if (!checkCurrentWSIsProject(wsfolder)) {
        vscode.window.showErrorMessage("You are not in a project folder, or your project is malformed! Cannot compile");
        return;
    }

    const opid = utils.newOpid();
    const tmpDir = ensureTempFolder(opid);

    // Copy the content of the workspace folder in the temp folder
    utils.copyWS(tmpDir);

    // Compile on the tmp folder
    progress.report({ increment: 50, message: "Compiling files..." });
    const artifactsFolder = await cli.compile(opid, cli.configuration.tryFetchServerInfoFromDataDir(), tmpDir, cleanAfter);

    progress.report({ increment: 90, message: "Copying files into output folder..." });
    const outFolder = utils.ensureOutFolder();

    // Copy artifacts from tmp to out dir
    // Directory artifactsFolder will contain a directory with the same basename as tmpDir
    utils.copyArtifacts(path.join(artifactsFolder, path.basename(tmpDir)), outFolder);
    
    progress.report({ increment: 100, message: "Finalizing..." });
    vscode.window.showInformationMessage(`Compilation successful! Artifacts can be found in the output folder`);
}

function ensureTempFolder(opid) {
    const appDataFolder = common.ensureDataDir(); // The librars folder in Data system folder (normalized)
    const tmpDir = path.join(appDataFolder, `${consts.CLI_FOLDER_PREFIX}-compile-${opid}`);

    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
    }

    return tmpDir;
}

function checkCurrentWSIsProject(currentWSFolder) {
    if (!currentWSFolder) {
        return false;
    }

    const indexFilePath = path.normalize(path.join(currentWSFolder, "index.md"));
    if (!fs.existsSync(indexFilePath)) {
        return false;
    }

    return true;
}

module.exports = {
    compile
}
