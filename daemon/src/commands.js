/**
 * commands.js
 * Andrea Tino - 2020
 * 
 * List of available commands.
 */

const common = require("@librars/cli-common");

const version = require("./version").version;

const commandHandlers = {
    compile: require("./handlers/compile").handleCompile,
    unknown: require("./handlers/unknown").handleUnknown,
    notcompatible: require("./handlers/notcompatible").handleNotCompatible
};

/** Compile. */
export const COMMAND_COMPILE = "compile";

/** Unknown command. */
export const COMMAND_UNKNOWN = "unknown";

/** Not-compatible command. */
export const COMMAND_NOTCOMPATIBLE = "notcompatible";

/**
 * Maps the proper command handler to the request.
 * 
 * @param {object} req The request object.
 * @returns {object} The command handler to handle the request. Null if not found.
 */
export function mapCommand(req) {
    switch (req.url) {
        case `/${COMMAND_COMPILE}`:
            return commandHandlers.compile;

        default:
            return commandHandlers.unknown;
    }
}

/**
 * Maps the proper command handler to the invalid request.
 * 
 * @param {object} req The request object.
 * @returns {{error, handler}} An object containing the command handler to handle
 *     the invalid request and the error message. Null if the request is valid.
 */
export function mapErrorHandlingCommand(req) {
    if (!checkApiVersion(req)) {
        return {
            error: `API version check failed for request. Request: ${getVersionHeaderValue(req)}, daemon: ${version.COMMUNICATION_API}`,
            handler: commandHandlers.notcompatible
        };
    }
}

function checkApiVersion(req) {
    const v = getVersionHeaderValue(req);
    const parsedVersion = common.checkVersionFormat(v, false);

    if (!parsedVersion) {
        return false;
    }

    return common.versionsCompatibilityCheck(parsedVersion, version.COMMUNICATION_API) >= 0;
}

function getVersionHeaderValue(req) {
    return common.communication.getVersionFromHTTPHeaders(req.headers);
}
