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

    // Decode and save the received archive
    fs.writeFileSync(dstPath, Buffer.from(reqBody, "base64"), "base64");
    common.log(`Archive written into: ${dstPath}`);

    // Create a new directory to host the extracted content of the archive
    const extractedDirPath = path.join(dstDir, `${consts.EXTRACTED_DIR_PREFIX}-${exid}`);
    fs.mkdirSync(extractedDirPath);

    // Extract the archive (this will also uncomporess)
    untar(dstPath, extractedDirPath).then((extractedDirPath) => {
        // Check that the created artifact folder has only one folder inside
        const extractedDirItems = fs.readdirSync(extractedDirPath);
        if (extractedDirItems.length !== 1) {
            common.error(`Artifact folder with extracted content should contain only one entry, found ${extractedDirItems.length}`);

            endResponseWithError(res, err);
            clean();
        }
        const compilationArtifactFolder = path.join(extractedDirPath, extractedDirItems[0]);
        if (!fs.statSync(compilationArtifactFolder).isDirectory) {
            common.error("Artifact folder with extracted content should contain only one directory (actual type is not directory)");

            endResponseWithError(res, err);
            clean();
        }

        common.log(`Artifacts extracted into: ${extractedDirPath}`);

        // Compile content
        // TODO

        // Archive folder with resulted compilation artifacts
        const directoryToTar = compilationArtifactFolder;
        createTar(directoryToTar, extractedDirPath, exid).then((tarPath) => {
            common.log(`Compile artifact tar created: ${tarPath}`);
            // Base64 encode
            const buffer = fs.readFileSync(tarPath);
            const base64data = buffer.toString("base64");
            common.log(`Compile artifact tar base64 computed (len: ${base64data.length}): ${base64data}`);

            // Send the archive back to the requestor
            commands.addRequiredHeadersToCommandResponse(res, exid);
            res.statusCode = common.communication.statusCodes.OK;
            res.statusMessage = "Ok";
            res.setHeader("Content-Type", "text/plain");

            common.log("Sending response back to client...");
            res.write(base64data, "utf-8", (err) => {
                if (err) {
                    common.error(`An error occurred while trying to send the result back to client: ${err}`);

                    clean();
                    return;
                }

                res.end(() => {
                    common.log("Response successfully transmitted :)");
                    clean();
                });
            });
        }).catch((err) => { // Catch createTar
            endResponseWithError(res, err);
            clean();
        });
    }).catch((err) => { // Catch untar
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
        // Since this folder also contains the tar created to send back
        // to the client, that resource will be cleared too
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

async function createTar(dirpath, dstDir, exid = null) {
    const tarFileName = `${consts.COMPILE_ARTIFACTS_TAR_FILE_PREFIX}-${exid || common.generateId(true)}`;

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
    const errorMsg = `An error occurred while processing the request: ${err}`;
    common.error(errorMsg);

    res.statusCode = common.communication.statusCodes.SRV_ERROR;
    res.statusMessage = errorMsg;
    res.end();
}
