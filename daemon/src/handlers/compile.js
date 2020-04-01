/**
 * compile.js
 * Andrea Tino - 2020
 * 
 * Handles a compile request.
 */

const fs = require("fs");
const path = require("path");

const common = require("@librars/cli-common");

const commands = require("../commands");
const consts = require("../consts");

/**
 * Handles a compile request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */
export function handleCompile(req, res) {
    common.log(`Handling command ${commands.COMMAND_COMPILE}...`);

    if (!checkRequest(req)) {
        res.statusCode = common.communication.statusCodes.BAD_REQUEST;
        res.end();

        return;
    }

    let buffer = "";

    const dstDir = path.join(path.normalize(common.getDataFolder()), common.DIR_NAME);
    const dstPath = path.join(dstDir, `${consts.TAR_FILE_PREFIX}-${Math.ceil(Math.random()*100000)}.tgz`);

    req.on("data", (data) => {
        common.log(`Data received: ${data}`);

        buffer += data;
    });

    req.on("end", () => {
        common.log("Request has been successfully received");
        common.log(`Data buffer (len: ${buffer.length}): ${buffer.substring(0, 100)}${buffer.length > 100 ? "..." : ""}`);

        // Save the archive
        fs.writeFileSync(dstPath, new Buffer(buffer, "base64"), "base64");
        common.log(`Archive written into: ${dstPath}`);

        // Extract the archive
        // TODO

        res.write("{'body': 'ok'}");
        res.end();
    });

    req.on("error", (err) => {
        common.error(`An error occurred while processing the request: ${err}`);

        res.statusCode = 500;
        res.end();
    });
}

function checkRequest(req) {
    if (req.method !== "POST") {
        common.error(`Command ${commands.COMMAND_COMPILE} requires a POST, received a ${req.method}`);
        return false;
    }

    return true;
}
