/**
 * compile.js
 * Andrea Tino - 2020
 * 
 * Handles a compile request.
 */

const utils = require("../utils");
const commands = require("../commands");

/**
 * Handles a compile request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */
export function handleCompile(req, res) {
    utils.log(`Handling command ${commands.COMMAND_COMPILE}...`);

    if (!checkRequest(req)) {
        res.statusCode = 500;
        res.end();

        return;
    }

    req.on("data", (data) => {
        utils.log(`Data received: ${data}`);
    });

    res.write("{'body': 'ok'}");
    res.end();
}

function checkRequest(req) {
    if (req.method !== "POST") {
        utils.error(`Command ${commands.COMMAND_COMPILE} requires a POST, received a ${req.method}`);
        return false;
    }

    return true;
}
