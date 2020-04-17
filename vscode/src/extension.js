/**
 * extension.js
 * Andrea Tino - 2020
 */

const vscode = require("vscode");

const commandCompile = require("./compile").compile;
const commandDraft = require("./draft").draft;
const commandHelp = require("./help").help;
const commandTestConection = require("./testConnection").testConnection;
const commandConfigure = require("./configure").configure;

/**
 * This method is called when your extension is activated
 * your extension is activated the very first time the command is executed.
 * 
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const r = vscode.commands.registerCommand;

	context.subscriptions.push(
		r("help", () => {
			commandHelp(context);
		}),
		r("compile", () => {
			commandCompile(context);
		}),
		r("new", () => {
			commandDraft(context);
		}),
		r("testConnection", () => {
			commandTestConection(context);
		}),
		r("configure", () => {
			commandConfigure(context);
		})
	);
}
exports.activate = activate;

/**
 * This method is called when your extension is deactivated.
 */
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
