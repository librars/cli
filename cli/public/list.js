"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = list;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * list.js
 * Andrea Tino - 2020
 * 
 * Executes a list command.
 */
var http = require("http");

var common = require("@librars/cli-common");

var commands = require("./commands");
/**
 * Lists the available templates.
 * 
 * @param {string} exid The command execution id. If null a random one is generated.
 * @param {any} serverinfo The server info object.
 * @returns {Promise} a promise.
 * @async
 */


function list(_x, _x2) {
  return _list.apply(this, arguments);
}

function _list() {
  _list = _asyncToGenerator(function* (exid, serverinfo) {
    if (!serverinfo) {
      throw new Error("Argument serverinfo canot be null or undefined");
    } // Transmit


    return new Promise((resolve, reject) => {
      var options = {
        hostname: serverinfo.url,
        port: serverinfo.port,
        path: "/".concat(commands.COMMAND_LIST),
        method: "POST",
        protocol: "http:",
        encoding: null,
        headers: {
          "Content-Type": "text/plain"
        }
      };
      commands.addRequiredHeadersToCommandRequest(options.headers, exid); // Handle all necessary headers

      var commandUrl = commands.buildCommandUrl(serverinfo, commands.COMMAND_LIST);
      common.log("Initiating transmission to: ".concat(commandUrl));
      var clientRequest = http.request(options, res => {
        // Response handler
        common.log("Response received. STATUS: ".concat(res.statusCode, ", HEADERS: ").concat(JSON.stringify(res.headers))); // Check status code

        if (res.statusCode != common.communication.statusCodes.OK) {
          common.error("Received server non-successful response (".concat(res.statusCode, "): '").concat(res.statusMessage, "'"));
          reject(res.statusMessage);
          return;
        } // Check headers and verify same ExID


        if (!checkHeadersFromServerResponse(res, exid)) {
          var errorMsg = "ExID mismatch when receiving response from server. Expected: ".concat(exid, ", got: ").concat(common.communication.getExecIdFromHTTPHeaders(res.getHeaders()));
          common.error(errorMsg);
          reject(errorMsg);
          return;
        }

        var data = "";
        res.on("data", chunk => {
          data += chunk;
        });
        res.on("end", () => {
          // Waiting to receive the response
          common.log("Data fully received from server (len: ".concat(data.length, "): ").concat(data));
          var parsedData = JSON.parse(data);

          if (!checkReceivedData(parsedData)) {
            var _errorMsg = "Received object is not well formed: '".concat(data, "'");

            common.error(_errorMsg);
            reject(_errorMsg);
            return;
          }

          var result = parsedData["templates"];
          common.log("List received: '".concat(JSON.stringify(result), "'"));
          common.log("Command ".concat(commands.COMMAND_LIST, " execution session (").concat(exid, ") completed :)"));
          resolve(result);
        }); // On end response
      }); // Callback http request

      clientRequest.on("error", err => {
        reject(err);
      }); // Transmit request body (empty)

      clientRequest.end(() => {
        common.log("Request tx completed. Data transmitted to ".concat(commandUrl));
        common.log("Awaiting response...");
      });
    }); // Promise
  });
  return _list.apply(this, arguments);
}

function checkReceivedData(receivedObject) {
  if (!receivedObject) {
    return false;
  }

  if (!receivedObject["templates"] || receivedObject["templates"].length === 0) {
    return false;
  }

  return true;
}

function checkHeadersFromServerResponse(res, exid) {
  var resHeaders = res.headers;

  if (common.communication.getExecIdFromHTTPHeaders(resHeaders) !== exid) {
    return false;
  }

  return true;
}