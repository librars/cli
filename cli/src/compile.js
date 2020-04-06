/**
 * compile.js
 * Andrea Tino - 2020
 * 
 * Executes a compile command.
 */

const fs = require("fs");
const path = require("path");
const http = require("http");

const common = require("@librars/cli-common");

const commands = require("./commands");
const consts = require("./consts");

// Configuration
const moveToTrash = true; // If false, it will permanently delete intermediate resources

/**
 * Compiles a book.
 * 
 * @param {string} exid The command execution id. If null a random one is generated.
 * @param {any} serverinfo The server info object.
 * @param {string} dirpath The path to the directory containing the book to compile.
 * @param {boolean} cleanAfter A value indicating whether to clean intermediate resources after the transmission completes.
 * @returns {Promise} a promise.
 * @async
 */
export async function compile(exid, serverinfo, dirpath, cleanAfter = true) {
    if (!serverinfo) {
        throw new Error("Argument serverinfo canot be null or undefined");
    }
    if (!dirpath) {
        throw new Error("Argument dirpath canot be null or undefined");
    }

    if (!fs.existsSync(dirpath)) {
        throw new Error(`dirpath ${dirpath} could not be found`);
    }
    if (!fs.statSync(dirpath).isDirectory) {
        throw new Error(`Path ${dirpath} does not point to a directory`);
    }

    // Generate the tar
    const tarPath = await createTar(dirpath, exid);
    common.log(`Tar created: ${tarPath}`);

    // Base64 encode
    const buffer = fs.readFileSync(tarPath);
    const base64data = buffer.toString("base64");
    common.log(`Tar base64 computed (len: ${base64data.length}): ${base64data}`);

    // Transmit the zip
    return new Promise((resolve, reject) => {
        const options = {
            hostname: serverinfo.url,
            port: serverinfo.port,
            path: `/${commands.COMMAND_COMPILE}`,
            method: "POST",
            protocol: "http:",
            encoding: null,
            headers: {
                "Content-Type": "text/plain"
            }
        };
        commands.addRequiredHeadersToCommandRequest(options.headers, exid); // Handle all necessary headers

        const commandUrl = commands.buildCommandUrl(serverinfo, commands.COMMAND_COMPILE);
        common.log(`Initiating transmission to: ${commandUrl}`);

        const clientRequest = http.request(options, (res) => { // Response handler
            common.log(`Response received. STATUS: ${res.statusCode}, HEADERS: ${JSON.stringify(res.headers)}`);

            // Check status code
            if (res.statusCode != common.communication.statusCodes.OK) {
                common.error(`Received server non-successful response (${res.statusCode}): '${res.statusMessage}'`);

                if (cleanAfter) {
                    clean(tarPath);
                }

                reject(res.statusMessage);
                return;
            }

            // Check headers and verify same ExID
            if (!checkHeadersFromServerResponse(res, exid)) {
                const errorMsg = `ExID mismatch when receiving response from server. Expected: ${exid}, got: ${common.communication.getExecIdFromHTTPHeaders(res.getHeaders())}`;
                common.error(errorMsg);

                if (cleanAfter) {
                    clean(tarPath);
                }

                reject(errorMsg);
                return;
            }

            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => { // Waiting to receive the response
                common.log(`Data fully received from server (len: ${data.length}): ${data}`);

                // Deserialize and save received archive
                const resultTarPath = deserializeAndSaveBase64String(data, `${consts.RCV_TAR_FILE_PREFIX}-${exid}.tgz`);
                common.log(`Server result archive written into: ${resultTarPath}`);

                // Extract the archive and move content into a created folder
                serveResultArchiveToUser(dirpath, resultTarPath, exid).then((extractedDirPath) => {
                    common.log(`Command result copied into: ${extractedDirPath}`);

                    // Completion
                    common.log(`Command ${commands.COMMAND_COMPILE} execution session (${exid}) completed :)`);

                    // Cleanup on finalize
                    if (cleanAfter) {
                        clean(tarPath, resultTarPath);
                    }

                    resolve(); // Resolve only when receiving the response
                }).catch((err) => {
                    common.error(`An error occurred while extracting received content '${resultTarPath}' from server: ${err}`);

                    if (cleanAfter) {
                        // Leave the result archive to inspect what went wrong in extraction process
                        // clean(tarPath, resultTarPath);
                        clean(tarPath);
                    }

                    reject(err);
                }); // Catch serveResultArchiveToUser
            }); // On end response
        }); // Callback http request

        clientRequest.on("error", (err) => {
            // Cleanup upon error
            if (cleanAfter) {
                clean(tarPath);
            }

            reject(err);
        });

        // Send request
        clientRequest.write(base64data, "utf-8", (err) => {
            if (err) {
                common.error(`Error while sending request: ${err}`);

                reject(err);
                return;
            }

            clientRequest.end(() => {
                common.log(`Request tx completed. Data transmitted to ${commandUrl}`);
                common.log("Awaiting response...");
            });
        });
    }); // Promise
}

async function serveResultArchiveToUser(userDirPath, tarPath, exid) {
    let userExtractionDir = path.dirname(userDirPath);
    if (!fs.existsSync(userExtractionDir)) {
        common.warn(`Could not extract result into ${userExtractionDir}, will extract into data folder instead`);
        userExtractionDir = common.ensureDataDir();
    }
    const userExtractionPath = path.join(userExtractionDir, `${consts.USR_EXTRACTION_DIR_COMPILE_PREFIX}-${exid}`);

    fs.mkdirSync(userExtractionPath);

    return untar(tarPath, userExtractionPath);
}

function checkHeadersFromServerResponse(res, exid) {
    const resHeaders = res.headers;

    if (common.communication.getExecIdFromHTTPHeaders(resHeaders) !== exid) {
        return false;
    }

    return true;
}

function deserializeAndSaveBase64String(data, filename) {
    const dstDir = common.ensureDataDir();
    const dstPath = path.join(dstDir, filename);

    fs.writeFileSync(dstPath, Buffer.from(data, "base64").toString("binary"), "binary");
    
    return dstPath;
}

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

function clean(tarPath, resultTarPath) {
    const _disposeFile = (p) => {
        if (moveToTrash) {
            common.log(`File ${p} moved to trash`);
            // TODO
            return;
        }
        common.filesystem.deleteFile(p);
        common.log(`File ${p} deleted`);
    };

    const disposeFile = (p) => {
        if (p && fs.existsSync(p)) {
            _disposeFile(p);
        }
    };

    disposeFile(tarPath);
    disposeFile(resultTarPath);
}
