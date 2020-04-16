"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleList = handleList;

/**
 * list.js
 * Andrea Tino - 2020
 * 
 * Handles a list request.
 */
var common = require("@librars/cli-common");

var commands = require("../commands");

var api = require("../api");
/**
 * Handles the request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */


function handleList(req, res) {
  common.log("Handling command ".concat(commands.COMMAND_LIST, "..."));

  if (!checkRequest(req)) {
    res.statusCode = common.communication.statusCodes.BAD_REQUEST;
    res.end();
    return;
  }

  var buffer = "";
  req.on("data", data => {
    common.log("Data received: ".concat(data));
    buffer += data;
  });
  req.on("end", () => {
    onRequestFullyReceived(req, res, buffer);
  });
  req.on("error", err => {
    endResponseWithError(res, err);
  });
}

function onRequestFullyReceived(req, res, reqBody) {
  var exid = common.communication.getExecIdFromHTTPHeaders(req.headers); // Guaranteed to be available

  common.log("Request has been successfully received"); // Get the template list

  common.log("Getting template list...");
  api.invoke(api.API.list).then(apiResult => {
    common.log("Template list retrieval completed: '".concat(JSON.stringify(apiResult), "'")); // Send the archive back to the requestor

    commands.addRequiredHeadersToCommandResponse(res, exid);
    res.statusCode = common.communication.statusCodes.OK;
    res.statusMessage = "Ok";
    res.setHeader("Content-Type", "text/plain");
    var data = apiResult["value"] || "";
    common.log("Sending response back to client with data: '".concat(data, "'..."));
    res.write(data, "utf-8", err => {
      if (err) {
        common.error("An error occurred while trying to send the result back to client: ".concat(err));
        return;
      }

      res.end(() => {
        common.log("Response successfully transmitted :)");
      });
    });
  }).catch(err => {
    // Catch API invocation
    endResponseWithError(res, err);
  }); // API invocation
}

function checkRequest(req) {
  if (req.method !== "POST") {
    common.error("Command ".concat(commands.COMMAND_LIST, " requires a POST, received a ").concat(req.method));
    return false;
  }

  return true;
}

function endResponseWithError(res, err) {
  var errorMsg = "An error occurred while processing the request: ".concat(err);
  common.error(errorMsg);
  res.statusCode = common.communication.statusCodes.SRV_ERROR;
  res.statusMessage = errorMsg;
  res.end();
}