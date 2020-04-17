/**
 * testConnection.js
 * Andrea Tino - 2020
 */

const vscode = require("vscode");

const cli = require("@librars/cli");
const common = require("@librars/cli-common");

/**
 * Performs the test connection command.
 * 
 * @param {*} context The comtext.
 */
function testConnection(context) {
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Testing connection with server",
        cancellable: true
    }, (progress, token) => {
        return new Promise((resolve, reject) => {
            token.onCancellationRequested(() => {
                reject(`Cancelled`);
                return;
            });

            doTestConnection(context, progress).then(() => {
                vscode.window.showInformationMessage("Connection ok!");
                resolve();
            }).catch((err) => {
                vscode.window.showErrorMessage("Connection test failed!");
                reject(err);
            });
        });
    });
}
exports.testConnection = testConnection;

async function doTestConnection(context, progress) {
    progress.report({ increment: 0, message: "Checking configuration..." });
    const serverinfo = cli.configuration.tryFetchServerInfoFromDataDir();
    const checkServerInfoIntegrity = cli.configuration.checkServerInfo(serverinfo);
    if (!checkServerInfoIntegrity) {
        vscode.window.showErrorMessage(`Connection failure. Bad configuration: '${JSON.stringify(serverinfo)}'`);
        return;
    }
    const uri = `${serverinfo.url}:${serverinfo.port}`;

    progress.report({ increment: 50, message: `Pinging ${uri}...` });
    const status = await cli.ping(common.generateId(false), serverinfo);

    progress.report({ increment: 100, message: "Checking status..." });

    return new Promise((resolve, reject) => {
        if (status === true) {
            resolve();
        } else {
            reject();
        }
    });
}

module.exports = {
    testConnection
}
