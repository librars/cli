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
var utils = require("../utils");

var commands = require("../commands");
/**
 * Handles a compile request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */


function handleNotCompatible(req, res) {
  utils.log("Handling command ".concat(commands.COMMAND_NOTCOMPATIBLE, "..."));
  utils.error("Request ".concat(req.method, ", ").concat(req.url, " is not compatible"));
  res.statusCode = 500;
  res.end();
}