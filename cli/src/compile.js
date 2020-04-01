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

const utils = require("./utils");
const commands = require("./commands");
const operations = require("./operations");
const version = require("./version").version;

/**
 * Compiles a book.
 * 
 * @param {any} serverinfo The server info object.
 * @param {string} dirpath The path to the directory containing the book to compile.
 * @param {boolean} cleanAfter A value indicating whether to clean intermediate resources after the transmission completes.
 * @returns {Promise} a promise.
 * @async
 */
export async function compile(serverinfo, dirpath, cleanAfter = true) {
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
    const tarPath = await createTar(dirpath);
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
        common.communication.addVersionHTTPHeaders(options.headers, version.COMMUNICATION_API); // Add version headers for API compatibility check

        const commandUrl = commands.buildCommandUrl(serverinfo, commands.COMMAND_COMPILE);
        common.log(`Initiating transmission to: ${commandUrl}`);

        const clientRequest = http.request(options, res => {
            common.log(`STATUS: ${res.statusCode}`);
            common.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            // res.setEncoding('utf8');

            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                common.log(data);

                // Cleanup on finalize
                if (cleanAfter) {
                    clean(tarPath);
                }

                resolve(); // Resolve only when receiving the response
            });
        });

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
                return;
            }

            clientRequest.end(() => {
                common.log(`Request tx completed. Data transmitted to ${commandUrl}`);
                common.log("Awaiting response...");
            });
        });
    });
}

async function createTar(dirpath) {
    const dstDir = common.ensureDataDir();
    const tarFileName = `tar-${common.generateId(true)}`;

    const tarPath = await operations.tarFolder(dirpath, dstDir, tarFileName);

    if (path.join(dstDir, `${tarFileName}.tgz`) !== tarPath) {
        throw new Error(`Created tar ${tarPath} was supposed to be in ${dstDir}.`);
    }

    return tarPath;
}

// eslint-disable-next-line no-unused-vars
async function untar(tarPath, dstFolder) {
    const extractedDirPath = await operations.untarFolder(tarPath, dstFolder);

    if (dstFolder !== extractedDirPath) {
        throw new Error(`Extracted content ${extractedDirPath} was supposed to be in ${dstFolder}.`);
    }

    return extractedDirPath;
}

function clean(tarPath) {
    if (!fs.existsSync(tarPath)) {
        return;
    }

    utils.deleteFile(tarPath);
    common.log(`File ${tarPath} deleted.`);
}
