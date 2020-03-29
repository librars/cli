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

var utils = require("../utils");

var commands = require("../commands");

var consts = require("../consts");
/**
 * Handles a compile request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */


function handleCompile(req, res) {
  utils.log("Handling command ".concat(commands.COMMAND_COMPILE, "..."));

  if (!checkRequest(req)) {
    res.statusCode = 500;
    res.end();
    return;
  }

  var buffer = [];
  var dstDir = path.join(path.normalize(utils.getDataFolder()), consts.DIR_NAME);
  var dstPath = path.join(dstDir, "rcv-".concat(Math.ceil(Math.random() * 100000), ".zip"));
  var dstStream = fs.createWriteStream(dstPath);
  req.pipe(dstStream);
  req.on("data", data => {
    utils.log("Data received: ".concat(data));
    buffer.push(data);
    /* dstStream.write(data, (error) => {
        if (error) {
            utils.error(`Error while trying to save zip into ${dstPath}: ${error}`);
            return;
        }
          utils.log(`Data written into ${dstPath}`);
    }); */
  });
  req.on("end", () => {
    utils.log("Request has been successfully received");
    utils.log("Data buffer (len: ".concat(buffer.length, "): ").concat(buffer));
    /* dstStream.write(Buffer.concat(buffer), "binary", (error) => {
        if (error) {
            utils.error(`Error while trying to save zip into ${dstPath}: ${error}`);
            return;
        }
          utils.log(`Data written into ${dstPath}`);
    }); */

    dstStream.close();
    res.write("{'body': 'ok'}");
    res.end();
  });
  req.on("error", err => {
    utils.error("An error occurred while processing the request: ".concat(err));
    dstStream.close();
    res.statusCode = 500;
    res.end();
  });
}

function checkRequest(req) {
  if (req.method !== "POST") {
    utils.error("Command ".concat(commands.COMMAND_COMPILE, " requires a POST, received a ").concat(req.method));
    return false;
  }

  return true;
}