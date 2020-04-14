/**
 * draft.js
 * Andrea Tino - 2020
 * 
 * Handles a draft request.
 */

const fs = require("fs");
const path = require("path");

const common = require("@librars/cli-common");

const commands = require("../commands");
const consts = require("../consts");
const api = require("../api");
const utils = require("../utils");

// Configuration
const cleanAfter = true;
const moveToTrash = true; // If false, it will permanently delete intermediate resources

/**
 * Handles the request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */
export function handleDraft(req, res) {
    common.log(`Handling command ${commands.COMMAND_DRAFT}...`);

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

    common.log("Request has been successfully received");

    // Get the request, expecting a JSON object: '{ "template_name": "<value>" }'
    const parsedReqBody = utils.parseJsonString(reqBody);
    if (!checkExpectedRequestBody(parsedReqBody)) {
        endResponseWithError(res, `Invalid request body received: '${reqBody}'. Parsing failed`);
        clean();
        return;
    }
    // Get the template name (guaranteed to exist and valid value at this point due to check before)
    const templateName = parsedReqBody["template_name"]; // TODO: create a message format in common

    // Create a new directory to host the draft documents
    const dstDir = path.join(path.normalize(common.getDataFolder()), common.DIR_NAME);
    const draftArtifactFolder = path.join(dstDir, `${consts.DRAFT_DIR_PREFIX}-${exid}`);
    fs.mkdirSync(draftArtifactFolder);

    // Get draft artifacts
    common.log(`Draft artifacts for template '${templateName}' will be retrieved and saved into: '${draftArtifactFolder}'...`);
    api.invoke(api.API.draft, templateName, draftArtifactFolder).then((msg) => {
        common.log(`Draft artifacts retrieval completed: '${msg}'`);

        // Archive folder with draft artifacts
        const directoryToTar = draftArtifactFolder;
        createTar(directoryToTar, dstDir, exid).then((tarPath) => {
            common.log(`Draft artifact tar created: ${tarPath}`);
            // Base64 encode
            const buffer = fs.readFileSync(tarPath);
            const base64data = buffer.toString("base64");
            common.log(`Draft artifact tar base64 computed (len: ${base64data.length}): ${base64data}`);

            // Send the archive back to the requestor
            commands.addRequiredHeadersToCommandResponse(res, exid);
            res.statusCode = common.communication.statusCodes.OK;
            res.statusMessage = "Ok";
            res.setHeader("Content-Type", "text/plain");

            common.log("Sending response back to client...");
            res.write(base64data, "utf-8", (err) => {
                if (err) {
                    common.error(`An error occurred while trying to send the result back to client: ${err}`);

                    clean(draftArtifactFolder, tarPath);
                    return;
                }

                res.end(() => {
                    common.log("Response successfully transmitted :)");
                    clean(draftArtifactFolder, tarPath);
                });
            });
        }).catch((err) => { // Catch createTar
            endResponseWithError(res, err);
            clean(draftArtifactFolder);
        });
    }).catch((err) => { // Catch API invocation
        endResponseWithError(res, err);
        clean(draftArtifactFolder);
    }); // API invocation
}

function clean(draftArtifactFolder, tarPath) {
    if (!cleanAfter) {
        return;
    }

    const disposeFile = (p) => {
        if (moveToTrash) {
            common.log(`File ${p} moved to trash`);
            // TODO
            return;
        }
        common.filesystem.deleteFile(p);
        common.log(`File ${p} deleted`);
    };
    const disposeDir = (p) => {
        if (moveToTrash) {
            common.log(`Directory ${p} moved to trash`);
            // TODO
            return;
        }
        common.filesystem.deleteDirectory(p);
        common.log(`Directory ${p} deleted`);
    };

    if (draftArtifactFolder && fs.existsSync(draftArtifactFolder)) {
        // Since this folder also contains the tar created to send back
        // to the client, that resource will be cleared too
        disposeDir(draftArtifactFolder);
    }

    if (tarPath && fs.existsSync(tarPath)) {
        disposeFile(tarPath);
    }
}

function checkRequest(req) {
    if (req.method !== "POST") {
        common.error(`Command ${commands.COMMAND_COMPILE} requires a POST, received a ${req.method}`);
        return false;
    }

    return true;
}

function checkExpectedRequestBody(parsedReqBody) {
    if (!parsedReqBody) {
        return false;
    }
    if (!parsedReqBody["template_name"]) {
        return false;
    }
    if (parsedReqBody["template_name"].length === 0) {
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

function endResponseWithError(res, err) {
    const errorMsg = `An error occurred while processing the request: ${err}`;
    common.error(errorMsg);

    res.statusCode = common.communication.statusCodes.SRV_ERROR;
    res.statusMessage = errorMsg;
    res.end();
}
