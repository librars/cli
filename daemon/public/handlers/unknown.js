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
var utils = require("../utils");

var commands = require("../commands");
/**
 * Handles a compile request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */


function handleUnknown(req, res) {
  utils.log("Handling command ".concat(commands.COMMAND_UNKNOWN, "..."));
  utils.error("Request ".concat(req, " could not be handled"));
  res.statusCode = 500;
  res.end();
}