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
var utils = require("../utils");

var commands = require("../commands");
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

  req.on("data", data => {
    utils.log("Data received: ".concat(data));
  });
  res.write("{'body': 'ok'}");
  res.end();
}

function checkRequest(req) {
  if (req.method !== "POST") {
    utils.error("Command ".concat(commands.COMMAND_COMPILE, " requires a POST, received a ").concat(req.method));
    return false;
  }

  return true;
}