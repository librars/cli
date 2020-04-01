"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleUnknown = handleUnknown;

/**
 * unknown.js
 * Andrea Tino - 2020
 * 
 * Handles an unknown request.
 */
var common = require("@librars/cli-common");

var commands = require("../commands");
/**
 * Handles the request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */


function handleUnknown(req, res) {
  common.log("Handling command ".concat(commands.COMMAND_UNKNOWN, "..."));
  common.error("Request ".concat(req, " could not be handled"));
  res.statusCode = common.communication.statusCodes.BAD_REQUEST;
  res.end();
}