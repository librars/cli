"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleNotCompatible = handleNotCompatible;

/**
 * notcompatible.js
 * Andrea Tino - 2020
 * 
 * Handles a non-compatible request.
 */
var common = require("@librars/cli-common");

var commands = require("../commands");
/**
 * Handles the request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */


function handleNotCompatible(req, res) {
  common.log("Handling command ".concat(commands.COMMAND_NOTCOMPATIBLE, "..."));
  common.error("Request ".concat(req.method, ", ").concat(req.url, " is not compatible"));
  res.statusCode = common.communication.statusCodes.BAD_REQUEST;
  res.end();
}