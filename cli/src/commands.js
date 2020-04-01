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
 * @returns {object} The same headers object.
 */
export function addRequiredHeadersToCommandRequest(headers) {
    // Version
    common.communication.addVersionHTTPHeaders(headers, version.COMMUNICATION_API);

    // Execution ID (ExID)
    common.communication.addExecIdHTTPHeaders(headers, common.generateId(false));
}
