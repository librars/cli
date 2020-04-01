/**
 * wrongformat.js
 * Andrea Tino - 2020
 * 
 * Handles a request with a wrong format.
 */

const common = require("@librars/cli-common");

const commands = require("../commands");

/**
 * Handles the request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */
export function handleWrongFormat(req, res) {
    common.log(`Handling command ${commands.COMMAND_WRONG_FORMAT}...`);
    common.error(`Request ${req} could not be handled`);

    res.statusCode = common.communication.statusCodes.BAD_REQUEST;
    res.end();
}
