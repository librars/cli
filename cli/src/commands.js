/**
 * commands.js
 * Andrea Tino - 2020
 * 
 * List of available commands.
 */

const common = require("@librars/cli-common");

const version = require("./version").version;

/**
 * Compile.
 */
export const COMMAND_COMPILE = "compile";

/**
 * Creates the proper URL to call a command.
 * 
 * @param {*} serverinfo The server info object.
 * @param {*} command The command to build.
 */
export function buildCommandUrl(serverinfo, command) {
    return `${serverinfo.url}:${serverinfo.port}/${command}`;
}

/**
 * Adds all required HTTP headers.
 * 
 * @param {object} headers The headers object.
 * @param {string} exid The execution id to assign. If null a new one is generated.
 * @returns {object} The same headers object.
 */
export function addRequiredHeadersToCommandRequest(headers, exid) {
    // Version
    common.communication.addVersionHTTPHeaders(headers, version.COMMUNICATION_API);

    // Execution ID (ExID)
    common.communication.addExecIdHTTPHeaders(headers, exid || common.generateId(false));
}

/**
 * Generates a new exid.
 * 
 * @returns {string} The new ID.
 */
export function newCommandExecId() {
    return common.generateId(false);
}
