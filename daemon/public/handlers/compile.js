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
/**
 * Handles a compile request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */


function handleCompile(req, res) {
  common.log("Handling command ".concat(commands.COMMAND_COMPILE, "..."));

  if (!checkRequest(req)) {
    res.statusCode = 500;
    res.end();
    return;
  }

  var buffer = "";
  var dstDir = path.join(path.normalize(common.getDataFolder()), common.DIR_NAME);
  var dstPath = path.join(dstDir, "rcv-".concat(Math.ceil(Math.random() * 100000), ".tgz"));
  req.on("data", data => {
    common.log("Data received: ".concat(data));
    buffer += data;
  });
  req.on("end", () => {
    common.log("Request has been successfully received");
    common.log("Data buffer (len: ".concat(buffer.length, "): ").concat(buffer));
    fs.writeFileSync(dstPath, new Buffer(buffer, "base64"), "base64");
    common.log("Zip written into: ".concat(dstPath));
    res.write("{'body': 'ok'}");
    res.end();
  });
  req.on("error", err => {
    common.error("An error occurred while processing the request: ".concat(err));
    res.statusCode = 500;
    res.end();
  });
}

function checkRequest(req) {
  if (req.method !== "POST") {
    common.error("Command ".concat(commands.COMMAND_COMPILE, " requires a POST, received a ").concat(req.method));
    return false;
  }

  return true;
}