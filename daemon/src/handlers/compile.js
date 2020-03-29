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

    const dstDir = path.join(path.normalize(utils.getDataFolder()), consts.DIR_NAME);
    const dstPath = path.join(dstDir, `rcv-${Math.ceil(Math.random()*100000)}.zip`);
    const dstStream = fs.createWriteStream(dstPath);

    req.on("data", (data) => {
        utils.log(`Data received: ${data}`);

        dstStream.write(data, (error) => {
            if (error) {
                utils.error(`Error while trying to save zip into ${dstPath}: ${error}`);
                return;
            }

            utils.log(`Data written into ${dstPath}`);
        });
    });

    req.on("end", () => {
        utils.log("Request has been successfully received");

        dstStream.close();

        res.write("{'body': 'ok'}");
        res.end();
    });

    req.on("error", (err) => {
        utils.error(`An error occurred while processing the request: ${err}`);

        dstStream.close();

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
