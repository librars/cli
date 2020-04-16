"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.draft = draft;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * draft.js
 * Andrea Tino - 2020
 * 
 * Executes a draft command.
 */
var fs = require("fs");

var path = require("path");

var http = require("http");

var common = require("@librars/cli-common");

var commands = require("./commands");

var consts = require("./consts");

var utils = require("./utils"); // Configuration


var moveToTrash = true; // If false, it will permanently delete intermediate resources

/**
 * Drafts a book.
 * 
 * @param {string} exid The command execution id. If null a random one is generated.
 * @param {any} serverinfo The server info object.
 * @param {string} templateName The name of the template whose draft files are requested.
 * @param {string} dirpath The path to the directory where to place the received files.
 * @param {boolean} cleanAfter A value indicating whether to clean intermediate resources after the transmission completes.
 * @returns {Promise} a promise.
 * @async
 */

function draft(_x, _x2, _x3, _x4) {
  return _draft.apply(this, arguments);
}

function _draft() {
  _draft = _asyncToGenerator(function* (exid, serverinfo, templateName, dirpath) {
    var cleanAfter = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

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
    } // Send the template name


    var requestBody = JSON.stringify({
      // TODO: Create a message format in common
      template_name: "".concat(templateName) // eslint-disable-line camelcase

    }); // Transmit the request

    return new Promise((resolve, reject) => {
      var options = {
        hostname: serverinfo.url,
        port: serverinfo.port,
        path: "/".concat(commands.COMMAND_DRAFT),
        method: "POST",
        protocol: "http:",
        encoding: null,
        headers: {
          "Content-Type": "text/plain"
        }
      };
      commands.addRequiredHeadersToCommandRequest(options.headers, exid); // Handle all necessary headers

      var commandUrl = commands.buildCommandUrl(serverinfo, commands.COMMAND_DRAFT);
      common.log("Initiating transmission to: ".concat(commandUrl));
      var clientRequest = http.request(options, res => {
        // Response handler
        common.log("Response received. STATUS: ".concat(res.statusCode, ", HEADERS: ").concat(JSON.stringify(res.headers))); // Check status code

        if (res.statusCode != common.communication.statusCodes.OK) {
          common.error("Received server non-successful response (".concat(res.statusCode, "): '").concat(res.statusMessage, "'"));

          if (cleanAfter) {
            clean();
          }

          reject(res.statusMessage);
          return;
        } // Check headers and verify same ExID


        if (!checkHeadersFromServerResponse(res, exid)) {
          var errorMsg = "ExID mismatch when receiving response from server. Expected: ".concat(exid, ", got: ").concat(common.communication.getExecIdFromHTTPHeaders(res.getHeaders()));
          common.error(errorMsg);

          if (cleanAfter) {
            clean();
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

          serveResultArchiveToUser(dirpath, resultTarPath, exid, templateName).then(extractedDirPath => {
            common.log("Command result copied into: ".concat(extractedDirPath)); // Completion

            common.log("Command ".concat(commands.COMMAND_DRAFT, " execution session (").concat(exid, ") completed :)")); // Cleanup on finalize

            if (cleanAfter) {
              clean(resultTarPath);
            }

            resolve(); // Resolve only when receiving the response
          }).catch(err => {
            common.error("An error occurred while extracting received content '".concat(resultTarPath, "' from server: ").concat(err));

            if (cleanAfter) {
              // Leave the result archive to inspect what went wrong in extraction process
              // clean(tarPath, resultTarPath);
              clean();
            }

            reject(err);
          }); // Catch serveResultArchiveToUser
        }); // On end response
      }); // Callback http request

      clientRequest.on("error", err => {
        // Cleanup upon error
        if (cleanAfter) {
          clean();
        }

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
  return _draft.apply(this, arguments);
}

function serveResultArchiveToUser(_x5, _x6, _x7, _x8) {
  return _serveResultArchiveToUser.apply(this, arguments);
}

function _serveResultArchiveToUser() {
  _serveResultArchiveToUser = _asyncToGenerator(function* (userDirPath, tarPath, exid, templateName) {
    var userExtractionDir = userDirPath;

    if (!fs.existsSync(userExtractionDir)) {
      common.warn("Could not extract result into ".concat(userExtractionDir, ", will extract into data folder instead"));
      userExtractionDir = common.ensureDataDir();
    }

    var userExtractionPath = path.join(userExtractionDir, "".concat(consts.USR_EXTRACTION_DIR_DRAFT_PREFIX, "-").concat(exid));
    fs.mkdirSync(userExtractionPath);
    var extractionDir = yield untar(tarPath, userExtractionPath);
    return new Promise((resolve, reject) => {
      if (extractionDir !== userExtractionPath) {
        reject("Received tar extraction dir does not match expected. Expected '".concat(userExtractionPath, "', got: '").concat(extractionDir, "'"));
        return;
      } // Check that the extracted folder has only one folder inside


      var extractedDirItems = fs.readdirSync(extractionDir);

      if (extractedDirItems.length !== 1) {
        reject("Artifact folder with extracted content should contain only one entry, found ".concat(extractedDirItems.length));
        return;
      }

      var draftArtifactFolder = path.join(extractionDir, extractedDirItems[0]);

      if (!fs.statSync(draftArtifactFolder).isDirectory) {
        reject("Artifact folder with extracted content should contain only one directory (actual type is not directory)");
        return;
      } // Rename the folder containing the draft artifacts to use the template name


      var newDraftArtifactFolder = path.join(extractionDir, utils.ensureProperFsNodeName(templateName));
      fs.renameSync(draftArtifactFolder, newDraftArtifactFolder); // Return the new path to the folder

      resolve(newDraftArtifactFolder);
    });
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

function untar(_x9, _x10) {
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

function clean(resultTarPath) {
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

  disposeFile(resultTarPath);
}