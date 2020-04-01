"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapCommand = mapCommand;
exports.mapErrorHandlingCommand = mapErrorHandlingCommand;
exports.COMMAND_NOTCOMPATIBLE = exports.COMMAND_UNKNOWN = exports.COMMAND_COMPILE = void 0;

/**
 * commands.js
 * Andrea Tino - 2020
 * 
 * List of available commands.
 */
var common = require("@librars/cli-common");

var version = require("./version").version;

var commandHandlers = {
  compile: require("./handlers/compile").handleCompile,
  unknown: require("./handlers/unknown").handleUnknown,
  notcompatible: require("./handlers/notcompatible").handleNotCompatible
};
/** Compile. */

var COMMAND_COMPILE = "compile";
/** Unknown command. */

exports.COMMAND_COMPILE = COMMAND_COMPILE;
var COMMAND_UNKNOWN = "unknown";
/** Not-compatible command. */

exports.COMMAND_UNKNOWN = COMMAND_UNKNOWN;
var COMMAND_NOTCOMPATIBLE = "notcompatible";
/**
 * Maps the proper command handler to the request.
 * 
 * @param {object} req The request object.
 * @returns {object} The command handler to handle the request. Null if not found.
 */

exports.COMMAND_NOTCOMPATIBLE = COMMAND_NOTCOMPATIBLE;

function mapCommand(req) {
  switch (req.url) {
    case "/".concat(COMMAND_COMPILE):
      return commandHandlers.compile;

    default:
      return commandHandlers.unknown;
  }
}
/**
 * Maps the proper command handler to the invalid request.
 * 
 * @param {object} req The request object.
 * @returns {{error, handler}} An object containing the command handler to handle
 *     the invalid request and the error message. Null if the request is valid.
 */


function mapErrorHandlingCommand(req) {
  if (!checkApiVersion(req)) {
    return {
      error: "API version check failed for request. Request: ".concat(getVersionHeaderValue(req), ", daemon: ").concat(version.COMMUNICATION_API),
      handler: commandHandlers.notcompatible
    };
  }
}

function checkApiVersion(req) {
  var v = getVersionHeaderValue(req);
  var parsedVersion = common.checkVersionFormat(v, false);

  if (!parsedVersion) {
    return false;
  }

  return common.versionsCompatibilityCheck(parsedVersion, version.COMMUNICATION_API) >= 0;
}

function getVersionHeaderValue(req) {
  return common.communication.getVersionFromHTTPHeaders(req.headers);
}