"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleWrongFormat = handleWrongFormat;

/**
 * wrongformat.js
 * Andrea Tino - 2020
 * 
 * Handles a request with a wrong format.
 */
var common = require("@librars/cli-common");

var commands = require("../commands");
/**
 * Handles the request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */


function handleWrongFormat(req, res) {
  common.log("Handling command ".concat(commands.COMMAND_WRONG_FORMAT, "..."));
  common.error("Request ".concat(req, " could not be handled"));
  res.statusCode = common.communication.statusCodes.BAD_REQUEST;
  res.end();
}