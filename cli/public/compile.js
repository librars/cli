"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compile = compile;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * compile.js
 * Andrea Tino - 2020
 * 
 * Executes a compile command.
 */
var fs = require("fs");

var path = require("path");

var http = require("http");

var common = require("@librars/cli-common");

var commands = require("./commands");

var consts = require("./consts"); // Configuration


var moveToTrash = true; // If false, it will permanently delete intermediate resources

/**
 * Compiles a book.
 * 
 * @param {string} exid The command execution id. If null a random one is generated.
 * @param {any} serverinfo The server info object.
 * @param {string} dirpath The path to the directory containing the book to compile.
 * @param {boolean} cleanAfter A value indicating whether to clean intermediate resources after the transmission completes.
 * @returns {Promise} a promise.
 * @async
 */

function compile(_x, _x2, _x3) {
  return _compile.apply(this, arguments);
}

function _compile() {
  _compile = _asyncToGenerator(function* (exid, serverinfo, dirpath) {
    var cleanAfter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    if (!serverinfo) {
      throw new Error("Argument serverinfo canot be null or undefined");
    }

    if (!dirpath) {
      throw new Error("Argument dirpath canot be null or undefined");
    }

    if (!fs.existsSync(dirpath)) {
      throw new Error("dirpath ".concat(dirpath, " could not be found"));
    }

    if (!fs.statSync(dirpath).isDirectory) {
      throw new Error("Path ".concat(dirpath, " does not point to a directory"));
    } // Generate the tar


    var tarPath = yield createTar(dirpath, exid);
    common.log("Tar created: ".concat(tarPath)); // Base64 encode

    var buffer = fs.readFileSync(tarPath);
    var base64data = buffer.toString("base64");
    common.log("Tar base64 computed (len: ".concat(base64data.length, "): ").concat(base64data)); // Transmit the zip

    return new Promise((resolve, reject) => {
      var options = {
        hostname: serverinfo.url,
        port: serverinfo.port,
        path: "/".concat(commands.COMMAND_COMPILE),
        method: "POST",
        protocol: "http:",
        encoding: null,
        headers: {
          "Content-Type": "text/plain"
        }
      };
      commands.addRequiredHeadersToCommandRequest(options.headers, exid); // Handle all necessary headers

      var commandUrl = commands.buildCommandUrl(serverinfo, commands.COMMAND_COMPILE);
      common.log("Initiating transmission to: ".concat(commandUrl));
      var clientRequest = http.request(options, res => {
        // Response handler
        common.log("Response received. STATUS: ".concat(res.statusCode, ", HEADERS: ").concat(JSON.stringify(res.headers))); // Check status code

        if (res.statusCode != common.communication.statusCodes.OK) {
          common.error("Received server non-successful response (".concat(res.statusCode, "): '").concat(res.statusMessage, "'"));

          if (cleanAfter) {
            clean(tarPath);
          }

          reject(res.statusMessage);
          return;
        } // Check headers and verify same ExID


        if (!checkHeadersFromServerResponse(res, exid)) {
          var errorMsg = "ExID mismatch when receiving response from server. Expected: ".concat(exid, ", got: ").concat(common.communication.getExecIdFromHTTPHeaders(res.getHeaders()));
          common.error(errorMsg);

          if (cleanAfter) {
            clean(tarPath);
          }

          reject(errorMsg);
          return;
        }

        var data = "";
        res.on("data", chunk => {
          data += chunk;
        });
        res.on("end", () => {
          // Waiting to receive the response
          common.log("Data fully received from server (len: ".concat(data.length, "): ").concat(data)); // Deserialize and save received archive

          var resultTarPath = deserializeAndSaveBase64String(data, "".concat(consts.RCV_TAR_FILE_PREFIX, "-").concat(exid, ".tgz"));
          common.log("Server result archive written into: ".concat(resultTarPath)); // Extract the archive and move content into a created folder

          serveResultArchiveToUser(dirpath, resultTarPath, exid).then(extractedDirPath => {
            common.log("Command result copied into: ".concat(extractedDirPath)); // Completion

            common.log("Command ".concat(commands.COMMAND_COMPILE, " execution session (").concat(exid, ") completed :)")); // Cleanup on finalize

            if (cleanAfter) {
              clean(tarPath, resultTarPath);
            }

            resolve(); // Resolve only when receiving the response
          }).catch(err => {
            common.error("An error occurred while extracting received content '".concat(resultTarPath, "' from server: ").concat(err));

            if (cleanAfter) {
              // Leave the result archive to inspect what went wrong in extraction process
              // clean(tarPath, resultTarPath);
              clean(tarPath);
            }

            reject(err);
          }); // Catch serveResultArchiveToUser
        }); // On end response
      }); // Callback http request

      clientRequest.on("error", err => {
        // Cleanup upon error
        if (cleanAfter) {
          clean(tarPath);
        }

        reject(err);
      }); // Send request

      clientRequest.write(base64data, "utf-8", err => {
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
  return _compile.apply(this, arguments);
}

function serveResultArchiveToUser(_x4, _x5, _x6) {
  return _serveResultArchiveToUser.apply(this, arguments);
}

function _serveResultArchiveToUser() {
  _serveResultArchiveToUser = _asyncToGenerator(function* (userDirPath, tarPath, exid) {
    var userExtractionDir = path.dirname(userDirPath);

    if (!fs.existsSync(userExtractionDir)) {
      common.warn("Could not extract result into ".concat(userExtractionDir, ", will extract into data folder instead"));
      userExtractionDir = common.ensureDataDir();
    }

    var userExtractionPath = path.join(userExtractionDir, "".concat(consts.USR_EXTRACTION_DIR_COMPILE_PREFIX, "-").concat(exid));
    fs.mkdirSync(userExtractionPath);
    return untar(tarPath, userExtractionPath);
  });
  return _serveResultArchiveToUser.apply(this, arguments);
}

function checkHeadersFromServerResponse(res, exid) {
  var resHeaders = res.headers;

  if (common.communication.getExecIdFromHTTPHeaders(resHeaders) !== exid) {
    return false;
  }

  return true;
}

function deserializeAndSaveBase64String(data, filename) {
  var dstDir = common.ensureDataDir();
  var dstPath = path.join(dstDir, filename);
  fs.writeFileSync(dstPath, Buffer.from(data, "base64").toString("binary"), "binary");
  return dstPath;
}

function createTar(_x7) {
  return _createTar.apply(this, arguments);
}

function _createTar() {
  _createTar = _asyncToGenerator(function* (dirpath) {
    var exid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var dstDir = common.ensureDataDir();
    var tarFileName = "".concat(consts.TAR_FILE_PREFIX, "-").concat(exid || common.generateId(true));
    var tarPath = yield common.filesystem.tarFolder(dirpath, dstDir, tarFileName);

    if (path.join(dstDir, "".concat(tarFileName, ".tgz")) !== tarPath) {
      throw new Error("Created tar ".concat(tarPath, " was supposed to be in ").concat(dstDir, "."));
    }

    return tarPath;
  });
  return _createTar.apply(this, arguments);
}

function untar(_x8, _x9) {
  return _untar.apply(this, arguments);
}

function _untar() {
  _untar = _asyncToGenerator(function* (tarPath, dstFolder) {
    var extractedDirPath = yield common.filesystem.untarFolder(tarPath, dstFolder);

    if (dstFolder !== extractedDirPath) {
      throw new Error("Extracted content ".concat(extractedDirPath, " was supposed to be in ").concat(dstFolder, "."));
    }

    return extractedDirPath;
  });
  return _untar.apply(this, arguments);
}

function clean(tarPath, resultTarPath) {
  var _disposeFile = p => {
    if (moveToTrash) {
      common.log("File ".concat(p, " moved to trash")); // TODO

      return;
    }

    common.filesystem.deleteFile(p);
    common.log("File ".concat(p, " deleted"));
  };

  var disposeFile = p => {
    if (p && fs.existsSync(p)) {
      _disposeFile(p);
    }
  };

  disposeFile(tarPath);
  disposeFile(resultTarPath);
}