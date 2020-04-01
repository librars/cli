"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleCompile = handleCompile;

/**
 * compile.js
 * Andrea Tino - 2020
 * 
 * Handles a compile request.
 */
var fs = require("fs");

var path = require("path");

var common = require("@librars/cli-common");

var commands = require("../commands");

var consts = require("../consts");
/**
 * Handles the request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */


function handleCompile(req, res) {
  common.log("Handling command ".concat(commands.COMMAND_COMPILE, "..."));

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
    common.error("An error occurred while processing the request: ".concat(err));
    res.statusCode = 500;
    res.end();
  });
}

function onRequestFullyReceived(req, res, reqBody) {
  var exid = common.communication.getExecIdFromHTTPHeaders(req.headers); // Guaranteed to be available

  var dstDir = path.join(path.normalize(common.getDataFolder()), common.DIR_NAME);
  var dstPath = path.join(dstDir, "".concat(consts.TAR_FILE_PREFIX, "-").concat(exid, ".tgz"));
  common.log("Request has been successfully received");
  common.log("Request body (len: ".concat(reqBody.length, "): ").concat(reqBody.substring(0, 100)).concat(reqBody.length > 100 ? "..." : "")); // Save the archive

  fs.writeFileSync(dstPath, Buffer.from(reqBody, "base64"), "base64");
  common.log("Archive written into: ".concat(dstPath)); // Extract the archive
  // TODO

  res.write("{'body': 'ok'}");
  res.end();
}

function checkRequest(req) {
  if (req.method !== "POST") {
    common.error("Command ".concat(commands.COMMAND_COMPILE, " requires a POST, received a ").concat(req.method));
    return false;
  }

  return true;
}