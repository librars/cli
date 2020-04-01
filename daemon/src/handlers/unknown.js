/**
 * unknown.js
 * Andrea Tino - 2020
 * 
 * Handles an unknown request.
 */

const common = require("@librars/cli-common");

const commands = require("../commands");

/**
 * Handles the request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */
export function handleUnknown(req, res) {
    common.log(`Handling command ${commands.COMMAND_UNKNOWN}...`);
    common.error(`Request ${req} could not be handled`);

    res.statusCode = common.communication.statusCodes.BAD_REQUEST;
    res.end();
}
