/**
 * compile.js
 * Andrea Tino - 2020
 * 
 * Executes a compile command.
 */

const fs = require("fs");
const path = require("path");
const http = require("http");

const utils = require("./utils");
const commands = require("./commands");
const operations = require("./operations");

/**
 * Compiles a book.
 * 
 * @param {any} serverinfo The server info object.
 * @param {string} dirpath The path to the directory containing the book to compile.
 * @param {boolean} cleanzip A value indicating whether to clean the zip after the transmission completes.
 * @returns {Promise} a promise.
 */
export async function compile(serverinfo, dirpath, cleanzip = true) {
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

    // Generate the zip
    const zipPath = await createZip(dirpath);
    utils.log(`Zip created: ${zipPath}`);

    // Base64 encode
    const buffer = fs.readFileSync(zipPath);
    const base64data = buffer.toString("base64");
    utils.log(`Zip base64 computed (len: ${base64data.length}): ${base64data}`);
    // fs.writeFileSync("C:/Users/antino/AppData/Roaming/librars/shit.zip", new Buffer(base64data, "base64"), "base64");

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
                "Content-Type": "text/plain",
                // "Content-Length": fs.statSync(zipPath).size
            }
        };

        const commandUrl = commands.buildCommandUrl(serverinfo, commands.COMMAND_COMPILE);
        utils.log(`Initiating transmission to: ${commandUrl}`);

        const clientRequest = http.request(options, res => {
            utils.log(`STATUS: ${res.statusCode}`);
            utils.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            // res.setEncoding('utf8');

            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                utils.log(data);

                // Cleanup on finalize
                if (cleanzip) {
                    cleanZip(zipPath);
                }

                resolve("ok"); // Resolve only when receiving the response
            });
        });

        clientRequest.on("error", (err) => {
            // Cleanup upon error
            if (cleanzip) {
                cleanZip(zipPath);
            }

            reject(err);
        });

        // Send request
        clientRequest.write(base64data, "utf-8", (err) => {
            if (err) {
                utils.error(`Error while sending request: ${err}`);
                return;
            }

            clientRequest.end(() => {
                utils.log(`Request tx completed. Data transmitted to ${commandUrl}`);
                utils.log("Awaiting response...");
            });
        });
    });
}

async function createZip(dirpath) {
    const dstDir = utils.ensureDataDir();
    const zipFileName = `zip-${utils.generateId(true)}`;
    const zipPath = await operations.zipFolder(dirpath, dstDir, zipFileName);

    if (path.join(dstDir, `${zipFileName}.zip`) !== zipPath) {
        throw new Error(`Created zip ${zipPath} was supposed to be in ${dstDir}.`);
    }

    return zipPath;
}

function cleanZip(zipPath) {
    if (!fs.existsSync(zipPath)) {
        return;
    }

    utils.deleteFile(zipPath);
    utils.log(`Zip file ${zipPath} deleted.`);
}
