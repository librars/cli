/**
 * ping.js
 * Andrea Tino - 2020
 * 
 * Handles a draft request.
 */

const common = require("@librars/cli-common");

const commands = require("../commands");
const utils = require("../utils");

/**
 * Handles the request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */
export function handlePing(req, res) {
    common.log(`Handling command ${commands.COMMAND_PING}...`);

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

    // Get the request, expecting a JSON object: '{ "echo": "<value>" }'
    const parsedReqBody = utils.parseJsonString(reqBody);
    if (!checkExpectedRequestBody(parsedReqBody)) {
        endResponseWithError(res, `Invalid request body received: '${reqBody}'. Parsing failed`);
        return;
    }
    // Get the echo vslue (guaranteed to exist and valid value at this point due to check before)
    const echoValue = parsedReqBody["echo"]; // TODO: create a message format in common

    // Process ping by sending the same value that was received
    common.log(`Processing ping with echo: '${echoValue}'...`);

    // Send the archive back to the requestor
    commands.addRequiredHeadersToCommandResponse(res, exid);
    res.statusCode = common.communication.statusCodes.OK;
    res.statusMessage = "Ok";
    res.setHeader("Content-Type", "text/plain");

    const responseData = JSON.stringify({
        echo: `${echoValue}`
    });
    
    res.write(responseData, "utf-8", (err) => {
        if (err) {
            common.error(`An error occurred while trying to send the result back to client: ${err}`);
            return;
        }

        res.end(() => {
            common.log("Response successfully transmitted :)");
        });
    });
}

function checkRequest(req) {
    if (req.method !== "POST") {
        common.error(`Command ${commands.COMMAND_PING} requires a POST, received a ${req.method}`);
        return false;
    }

    return true;
}

function checkExpectedRequestBody(parsedReqBody) {
    if (!parsedReqBody) {
        return false;
    }
    if (!parsedReqBody["echo"]) {
        return false;
    }
    if (parsedReqBody["echo"].length === 0) {
        return false;
    }

    return true;
}

function endResponseWithError(res, err) {
    const errorMsg = `An error occurred while processing the request: ${err}`;
    common.error(errorMsg);

    res.statusCode = common.communication.statusCodes.SRV_ERROR;
    res.statusMessage = errorMsg;
    res.end();
}
