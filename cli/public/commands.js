"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildCommandUrl = buildCommandUrl;
exports.addRequiredHeadersToCommandRequest = addRequiredHeadersToCommandRequest;
exports.newCommandExecId = newCommandExecId;
exports.COMMAND_DRAFT = exports.COMMAND_COMPILE = void 0;

/**
 * commands.js
 * Andrea Tino - 2020
 * 
 * List of available commands.
 */
var common = require("@librars/cli-common");

var version = require("./version").version;
/** Compile. */


var COMMAND_COMPILE = "compile";
/** Draft. */

exports.COMMAND_COMPILE = COMMAND_COMPILE;
var COMMAND_DRAFT = "draft";
/**
 * Creates the proper URL to call a command.
 * 
 * @param {*} serverinfo The server info object.
 * @param {*} command The command to build.
 */

exports.COMMAND_DRAFT = COMMAND_DRAFT;

function buildCommandUrl(serverinfo, command) {
  return "".concat(serverinfo.url, ":").concat(serverinfo.port, "/").concat(command);
}
/**
 * Adds all required HTTP headers.
 * 
 * @param {object} headers The headers object.
 * @param {string} exid The execution id to assign. If null a new one is generated.
 */


function addRequiredHeadersToCommandRequest(headers, exid) {
  // Version
  common.communication.addVersionHTTPHeaders(headers, version.COMMUNICATION_API); // Execution ID (ExID)

  common.communication.addExecIdHTTPHeaders(headers, exid || common.generateId(false));
}
/**
 * Generates a new exid.
 * 
 * @returns {string} The new ID.
 */


function newCommandExecId() {
  return common.generateId(false);
}