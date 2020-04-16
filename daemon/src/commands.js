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
    draft: require("./handlers/draft").handleDraft,
    list: require("./handlers/list").handleList,
    unknown: require("./handlers/unknown").handleUnknown,
    notcompatible: require("./handlers/notcompatible").handleNotCompatible
};

/** Compile. */
export const COMMAND_COMPILE = "compile";

/** Draft. */
export const COMMAND_DRAFT = "draft";

/** List. */
export const COMMAND_LIST = "list";

/** Unknown command. */
export const COMMAND_UNKNOWN = "unknown";

/** Wrong formatted command. */
export const COMMAND_WRONG_FORMAT = "wrong_format";

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

        case `/${COMMAND_DRAFT}`:
            return commandHandlers.draft;

        case `/${COMMAND_LIST}`:
            return commandHandlers.list;

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
            error: `API version check failed for request. Request: ${common.communication.getVersionFromHTTPHeaders(req.headers)}, daemon: ${version.COMMUNICATION_API}`,
            handler: commandHandlers.notcompatible
        };
    }

    if (!checkExecId(req)) {
        return {
            error: `ExID check failed for request. Invalid ExID: ${common.communication.getExecIdFromHTTPHeaders(req.headers)}`,
            handler: commandHandlers.COMMAND_WRONG_FORMAT
        };
    }
}

/**
 * Adds all required HTTP headers to the response.
 * 
 * @param {object} res The response object.
 * @param {string} exid The execution id to assign. If null a new one is generated.
 */
export function addRequiredHeadersToCommandResponse(res, exid) {
    let headers = {};

    // Version
    common.communication.addVersionHTTPHeaders(headers, version.COMMUNICATION_API);

    // Execution ID (ExID)
    common.communication.addExecIdHTTPHeaders(headers, exid || common.generateId(false));

    const keys = Object.keys(headers);
    for (let i = 0; i < keys.length; i++) {
        const headerName = keys[i];
        const headerValue = headers[headerName];
        res.setHeader(headerName, headerValue);
    }
}

function checkApiVersion(req) {
    const versionFromHeaders = common.communication.getVersionFromHTTPHeaders(req.headers);
    const parsedVersion = common.checkVersionFormat(versionFromHeaders, false);

    if (!parsedVersion) {
        return false;
    }

    return common.versionsCompatibilityCheck(parsedVersion, version.COMMUNICATION_API) >= 0;
}

function checkExecId(req) {
    const exidFromHeaders = common.communication.getExecIdFromHTTPHeaders(req.headers);

    if (!exidFromHeaders) {
        return false;
    }

    return exidFromHeaders.length > 0;
}
