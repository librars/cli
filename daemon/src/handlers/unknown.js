/**
 * unknown.js
 * Andrea Tino - 2020
 * 
 * Handles an unknown request.
 */

const utils = require("../utils");
const commands = require("../commands");

/**
 * Handles a compile request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */
export function handleUnknown(req, res) {
    utils.log(`Handling command ${commands.COMMAND_UNKNOWN}...`);
    utils.error(`Request ${req} could not be handled`);

    res.statusCode = 500;
    res.end();
}
