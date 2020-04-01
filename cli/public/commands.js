"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildCommandUrl = buildCommandUrl;
exports.addRequiredHeadersToCommandRequest = addRequiredHeadersToCommandRequest;
exports.COMMAND_COMPILE = void 0;

/**
 * commands.js
 * Andrea Tino - 2020
 * 
 * List of available commands.
 */
var common = require("@librars/cli-common");

var version = require("./version").version;
/**
 * Compile.
 */


var COMMAND_COMPILE = "compile";
/**
 * Creates the proper URL to call a command.
 * 
 * @param {*} serverinfo The server info object.
 * @param {*} command The command to build.
 */

exports.COMMAND_COMPILE = COMMAND_COMPILE;

function buildCommandUrl(serverinfo, command) {
  return "".concat(serverinfo.url, ":").concat(serverinfo.port, "/").concat(command);
}
/**
 * Adds all required HTTP headers.
 * 
 * @param {object} headers The headers object.
 * @returns {object} The same headers object.
 */


function addRequiredHeadersToCommandRequest(headers) {
  // Version
  common.communication.addVersionHTTPHeaders(headers, version.COMMUNICATION_API); // Execution ID (ExID)

  common.communication.addExecIdHTTPHeaders(headers, common.generateId(false));
}