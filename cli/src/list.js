/**
 * list.js
 * Andrea Tino - 2020
 * 
 * Executes a list command.
 */

const http = require("http");

const common = require("@librars/cli-common");

const commands = require("./commands");

/**
 * Lists the available templates.
 * 
 * @param {string} exid The command execution id. If null a random one is generated.
 * @param {any} serverinfo The server info object.
 * @returns {Promise} a promise.
 * @async
 */
export async function list(exid, serverinfo) {
    if (!serverinfo) {
        throw new Error("Argument serverinfo canot be null or undefined");
    }

    // Transmit
    return new Promise((resolve, reject) => {
        const options = {
            hostname: serverinfo.url,
            port: serverinfo.port,
            path: `/${commands.COMMAND_LIST}`,
            method: "POST",
            protocol: "http:",
            encoding: null,
            headers: {
                "Content-Type": "text/plain"
            }
        };
        commands.addRequiredHeadersToCommandRequest(options.headers, exid); // Handle all necessary headers

        const commandUrl = commands.buildCommandUrl(serverinfo, commands.COMMAND_LIST);
        common.log(`Initiating transmission to: ${commandUrl}`);

        const clientRequest = http.request(options, (res) => { // Response handler
            common.log(`Response received. STATUS: ${res.statusCode}, HEADERS: ${JSON.stringify(res.headers)}`);

            // Check status code
            if (res.statusCode != common.communication.statusCodes.OK) {
                common.error(`Received server non-successful response (${res.statusCode}): '${res.statusMessage}'`);

                reject(res.statusMessage);
                return;
            }

            // Check headers and verify same ExID
            if (!checkHeadersFromServerResponse(res, exid)) {
                const errorMsg = `ExID mismatch when receiving response from server. Expected: ${exid}, got: ${common.communication.getExecIdFromHTTPHeaders(res.getHeaders())}`;
                common.error(errorMsg);

                reject(errorMsg);
                return;
            }

            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => { // Waiting to receive the response
                common.log(`Data fully received from server (len: ${data.length}): ${data}`);

                const parsedData = JSON.parse(data);
                if (!checkReceivedData(parsedData)) {
                    const errorMsg = `Received object is not well formed: '${data}'`;
                    common.error(errorMsg);

                    reject(errorMsg);
                    return;
                }

                const result = parsedData["templates"];
                common.log(`List received: '${JSON.stringify(result)}'`);
                common.log(`Command ${commands.COMMAND_LIST} execution session (${exid}) completed :)`);

                resolve(result);
            }); // On end response
        }); // Callback http request

        clientRequest.on("error", (err) => {
            reject(err);
        });

        // Transmit request body (empty)
        clientRequest.end(() => {
            common.log(`Request tx completed. Data transmitted to ${commandUrl}`);
            common.log("Awaiting response...");
        });
    }); // Promise
}

function checkReceivedData(receivedObject) {
    if (!receivedObject) {
        return false;
    }
    if (!receivedObject["templates"] || receivedObject["templates"].length === 0) {
        return false;
    }
    return true;
}

function checkHeadersFromServerResponse(res, exid) {
    const resHeaders = res.headers;

    if (common.communication.getExecIdFromHTTPHeaders(resHeaders) !== exid) {
        return false;
    }

    return true;
}
