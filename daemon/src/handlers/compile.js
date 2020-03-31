/**
 * compile.js
 * Andrea Tino - 2020
 * 
 * Handles a compile request.
 */

const fs = require("fs");
const path = require("path");

const utils = require("../utils");
const commands = require("../commands");
const consts = require("../consts");

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

    let buffer = "";

    const dstDir = path.join(path.normalize(utils.getDataFolder()), consts.DIR_NAME);
    const dstPath = path.join(dstDir, `rcv-${Math.ceil(Math.random()*100000)}.tgz`);

    req.on("data", (data) => {
        utils.log(`Data received: ${data}`);

        buffer += data;
    });

    req.on("end", () => {
        utils.log("Request has been successfully received");
        utils.log(`Data buffer (len: ${buffer.length}): ${buffer}`);

        fs.writeFileSync(dstPath, new Buffer(buffer, "base64"), "base64");
        utils.log(`Zip written into: ${dstPath}`);

        res.write("{'body': 'ok'}");
        res.end();
    });

    req.on("error", (err) => {
        utils.error(`An error occurred while processing the request: ${err}`);

        res.statusCode = 500;
        res.end();
    });
}

function checkRequest(req) {
    if (req.method !== "POST") {
        utils.error(`Command ${commands.COMMAND_COMPILE} requires a POST, received a ${req.method}`);
        return false;
    }

    return true;
}
