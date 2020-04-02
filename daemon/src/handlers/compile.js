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

// Configuration
const cleanAfter = true;

/**
 * Handles the request.
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

    req.on("data", (data) => {
        common.log(`Data received: ${data}`);

        buffer += data;
    });

    req.on("end", () => {
        onRequestFullyReceived(req, res, buffer);
    });

    req.on("error", (err) => {
        endResponseWithError(res, err);
    });
}

function onRequestFullyReceived(req, res, reqBody) {
    const exid = common.communication.getExecIdFromHTTPHeaders(req.headers); // Guaranteed to be available
    const dstDir = path.join(path.normalize(common.getDataFolder()), common.DIR_NAME);
    const dstPath = path.join(dstDir, `${consts.TAR_FILE_PREFIX}-${exid}.tgz`); // Path where to save the received tar

    common.log("Request has been successfully received");
    common.log(`Request body (len: ${reqBody.length}): ${reqBody.substring(0, 100)}${reqBody.length > 100 ? "..." : ""}`);

    // Save the received archive
    fs.writeFileSync(dstPath, Buffer.from(reqBody, "base64"), "base64");
    common.log(`Archive written into: ${dstPath}`);

    // Create a new directory to host the extracted content of the archive
    const extractedDirPath = path.join(dstDir, `${consts.EXTRACTED_DIR_PREFIX}-${exid}`);
    fs.mkdirSync(extractedDirPath);

    // Extract the archive (this will also uncomporess)
    untar(dstPath, extractedDirPath).then((extractedDirPath) => {
        common.log(`Artifacts extracted into: ${extractedDirPath}`);

        // Compile content
        // TODO

        res.write("{'body': 'ok'}");
        res.end();

        clean();
    }).catch((err) => {
        endResponseWithError(res, err);
        clean();
    });
}

function clean(tarPath, extractedDirPath) {
    if (!cleanAfter) {
        return;
    }

    if (fs.existsSync(tarPath)) {
        common.filesystem.deleteFile(tarPath);
    }

    if (fs.existsSync(extractedDirPath)) {
        common.filesystem.deleteDirectory(extractedDirPath);
    }
}

function checkRequest(req) {
    if (req.method !== "POST") {
        common.error(`Command ${commands.COMMAND_COMPILE} requires a POST, received a ${req.method}`);
        return false;
    }

    return true;
}

// eslint-disable-next-line no-unused-vars
async function createTar(dirpath, exid = null) {
    const dstDir = common.ensureDataDir();
    const tarFileName = `${consts.TAR_FILE_PREFIX}-${exid || common.generateId(true)}`;

    const tarPath = await common.filesystem.tarFolder(dirpath, dstDir, tarFileName);

    if (path.join(dstDir, `${tarFileName}.tgz`) !== tarPath) {
        throw new Error(`Created tar ${tarPath} was supposed to be in ${dstDir}.`);
    }

    return tarPath;
}

async function untar(tarPath, dstFolder) {
    const extractedDirPath = await common.filesystem.untarFolder(tarPath, dstFolder);

    if (dstFolder !== extractedDirPath) {
        throw new Error(`Extracted content ${extractedDirPath} was supposed to be in ${dstFolder}.`);
    }

    return extractedDirPath;
}

function endResponseWithError(res, err) {
    common.error(`An error occurred while processing the request: ${err}`);

    res.statusCode = common.communication.statusCodes.SRV_ERROR;
    res.end();
}
