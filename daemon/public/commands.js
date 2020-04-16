"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapCommand = mapCommand;
exports.mapErrorHandlingCommand = mapErrorHandlingCommand;
exports.addRequiredHeadersToCommandResponse = addRequiredHeadersToCommandResponse;
exports.COMMAND_NOTCOMPATIBLE = exports.COMMAND_WRONG_FORMAT = exports.COMMAND_UNKNOWN = exports.COMMAND_LIST = exports.COMMAND_DRAFT = exports.COMMAND_COMPILE = exports.COMMAND_PING = void 0;

/**
 * commands.js
 * Andrea Tino - 2020
 * 
 * List of available commands.
 */
var common = require("@librars/cli-common");

var version = require("./version").version;

var commandHandlers = {
  ping: require("./handlers/ping").handlePing,
  compile: require("./handlers/compile").handleCompile,
  draft: require("./handlers/draft").handleDraft,
  list: require("./handlers/list").handleList,
  unknown: require("./handlers/unknown").handleUnknown,
  notcompatible: require("./handlers/notcompatible").handleNotCompatible
};
/** Ping. */

var COMMAND_PING = "ping";
/** Compile. */

exports.COMMAND_PING = COMMAND_PING;
var COMMAND_COMPILE = "compile";
/** Draft. */

exports.COMMAND_COMPILE = COMMAND_COMPILE;
var COMMAND_DRAFT = "draft";
/** List. */

exports.COMMAND_DRAFT = COMMAND_DRAFT;
var COMMAND_LIST = "list";
/** Unknown command. */

exports.COMMAND_LIST = COMMAND_LIST;
var COMMAND_UNKNOWN = "unknown";
/** Wrong formatted command. */

exports.COMMAND_UNKNOWN = COMMAND_UNKNOWN;
var COMMAND_WRONG_FORMAT = "wrong_format";
/** Not-compatible command. */

exports.COMMAND_WRONG_FORMAT = COMMAND_WRONG_FORMAT;
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
    case "/".concat(COMMAND_PING):
      return commandHandlers.ping;

    case "/".concat(COMMAND_COMPILE):
      return commandHandlers.compile;

    case "/".concat(COMMAND_DRAFT):
      return commandHandlers.draft;

    case "/".concat(COMMAND_LIST):
      return commandHandlers.list;

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
      error: "API version check failed for request. Request: ".concat(common.communication.getVersionFromHTTPHeaders(req.headers), ", daemon: ").concat(version.COMMUNICATION_API),
      handler: commandHandlers.notcompatible
    };
  }

  if (!checkExecId(req)) {
    return {
      error: "ExID check failed for request. Invalid ExID: ".concat(common.communication.getExecIdFromHTTPHeaders(req.headers)),
      handler: commandHandlers.COMMAND_WRONG_FORMAT
    };
  }
}
/**
 * Adds all required HTTP headers to the response.
 * 
 * @param {object} res The response object.
 * @param {string} exid The execution id to assign. If null a new one is generated.
 */


function addRequiredHeadersToCommandResponse(res, exid) {
  var headers = {}; // Version

  common.communication.addVersionHTTPHeaders(headers, version.COMMUNICATION_API); // Execution ID (ExID)

  common.communication.addExecIdHTTPHeaders(headers, exid || common.generateId(false));
  var keys = Object.keys(headers);

  for (var i = 0; i < keys.length; i++) {
    var headerName = keys[i];
    var headerValue = headers[headerName];
    res.setHeader(headerName, headerValue);
  }
}

function checkApiVersion(req) {
  var versionFromHeaders = common.communication.getVersionFromHTTPHeaders(req.headers);
  var parsedVersion = common.checkVersionFormat(versionFromHeaders, false);

  if (!parsedVersion) {
    return false;
  }

  return common.versionsCompatibilityCheck(parsedVersion, version.COMMUNICATION_API) >= 0;
}

function checkExecId(req) {
  var exidFromHeaders = common.communication.getExecIdFromHTTPHeaders(req.headers);

  if (!exidFromHeaders) {
    return false;
  }

  return exidFromHeaders.length > 0;
}