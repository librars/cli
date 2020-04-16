"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ping = ping;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * ping.js
 * Andrea Tino - 2020
 * 
 * Executes a list command.
 */
var http = require("http");

var common = require("@librars/cli-common");

var commands = require("./commands");
/**
 * Pings the daemon.
 * 
 * @param {string} exid The command execution id. If null a random one is generated.
 * @param {any} serverinfo The server info object.
 * @returns {Promise} a promise.
 * @async
 */


function ping(_x, _x2) {
  return _ping.apply(this, arguments);
}

function _ping() {
  _ping = _asyncToGenerator(function* (exid, serverinfo) {
    if (!serverinfo) {
      throw new Error("Argument serverinfo canot be null or undefined");
    } // Send the ping content


    var echoContent = common.generateId(false);
    var requestBody = JSON.stringify({
      // TODO: Create a message format in common
      echo: "".concat(echoContent)
    }); // Transmit

    return new Promise((resolve, reject) => {
      var options = {
        hostname: serverinfo.url,
        port: serverinfo.port,
        path: "/".concat(commands.COMMAND_PING),
        method: "POST",
        protocol: "http:",
        encoding: null,
        headers: {
          "Content-Type": "text/plain"
        }
      };
      commands.addRequiredHeadersToCommandRequest(options.headers, exid); // Handle all necessary headers

      var commandUrl = commands.buildCommandUrl(serverinfo, commands.COMMAND_PING);
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

          if (!checkEcho(parsedData["echo"], echoContent)) {
            var _errorMsg2 = "Received echo does not match sent echo. Sent: '".concat(echoContent, "', received: '").concat(parsedData["echo"], "'");

            common.error(_errorMsg2);
            reject(_errorMsg2);
            return;
          }

          common.log("Echo successfully exchanged. Sent: '".concat(echoContent, "', received: '").concat(parsedData["echo"], "'"));
          common.log("Command ".concat(commands.COMMAND_PING, " execution session (").concat(exid, ") completed :)"));
          resolve(true);
        }); // On end response
      }); // Callback http request

      clientRequest.on("error", err => {
        reject(err);
      }); // Transmit request body

      clientRequest.write(requestBody, "utf-8", err => {
        if (err) {
          common.error("Error while sending request: ".concat(err));
          reject(err);
          return;
        }

        clientRequest.end(() => {
          common.log("Request tx completed. Data transmitted to ".concat(commandUrl));
          common.log("Awaiting response...");
        });
      });
    }); // Promise
  });
  return _ping.apply(this, arguments);
}

function checkEcho(received, sent) {
  if (!received || !sent) {
    return false;
  }

  return received === sent;
}

function checkReceivedData(receivedObject) {
  if (!receivedObject) {
    return false;
  }

  if (!receivedObject["echo"] || receivedObject["echo"].length === 0) {
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