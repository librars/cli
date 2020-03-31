/**
 * notcompatible.js
 * Andrea Tino - 2020
 * 
 * Handles a non-compatible request.
 */

const common = require("@librars/cli-common");

const commands = require("../commands");

/**
 * Handles a compile request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */
export function handleNotCompatible(req, res) {
    common.log(`Handling command ${commands.COMMAND_NOTCOMPATIBLE}...`);
    common.error(`Request ${req.method}, ${req.url} is not compatible`);

    res.statusCode = 500;
    res.end();
}
