"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildCommandUrl = buildCommandUrl;
exports.COMMAND_COMPILE = void 0;

/**
 * commands.js
 * Andrea Tino - 2020
 * 
 * List of available commands.
 */

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