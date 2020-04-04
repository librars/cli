"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleCompile = handleCompile;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * compile.js
 * Andrea Tino - 2020
 * 
 * Handles a compile request.
 */
var fs = require("fs");

var path = require("path");

var common = require("@librars/cli-common");

var commands = require("../commands");

var consts = require("../consts"); // Configuration


var cleanAfter = true;
/**
 * Handles the request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */

function handleCompile(req, res) {
  common.log("Handling command ".concat(commands.COMMAND_COMPILE, "..."));

  if (!checkRequest(req)) {
    res.statusCode = common.communication.statusCodes.BAD_REQUEST;
    res.end();
    return;
  }

  var buffer = "";
  req.on("data", data => {
    common.log("Data received: ".concat(data));
    buffer += data;
  });
  req.on("end", () => {
    onRequestFullyReceived(req, res, buffer);
  });
  req.on("error", err => {
    endResponseWithError(res, err);
  });
}

function onRequestFullyReceived(req, res, reqBody) {
  var exid = common.communication.getExecIdFromHTTPHeaders(req.headers); // Guaranteed to be available

  var dstDir = path.join(path.normalize(common.getDataFolder()), common.DIR_NAME);
  var dstPath = path.join(dstDir, "".concat(consts.TAR_FILE_PREFIX, "-").concat(exid, ".tgz")); // Path where to save the received tar

  common.log("Request has been successfully received");
  common.log("Request body (len: ".concat(reqBody.length, "): ").concat(reqBody.substring(0, 100)).concat(reqBody.length > 100 ? "..." : "")); // Decode and save the received archive

  fs.writeFileSync(dstPath, Buffer.from(reqBody, "base64"), "base64");
  common.log("Archive written into: ".concat(dstPath)); // Create a new directory to host the extracted content of the archive

  var extractedDirPath = path.join(dstDir, "".concat(consts.EXTRACTED_DIR_PREFIX, "-").concat(exid));
  fs.mkdirSync(extractedDirPath); // Extract the archive (this will also uncomporess)

  untar(dstPath, extractedDirPath).then(extractedDirPath => {
    // Check that the created artifact folder has only one folder inside
    var extractedDirItems = fs.readdirSync(extractedDirPath);

    if (extractedDirItems.length !== 1) {
      common.error("Artifact folder with extracted content should contain only one entry, found ".concat(extractedDirItems.length));
      endResponseWithError(res, err);
      clean(dstPath, extractedDirPath);
    }

    var compilationArtifactFolder = path.join(extractedDirPath, extractedDirItems[0]);

    if (!fs.statSync(compilationArtifactFolder).isDirectory) {
      common.error("Artifact folder with extracted content should contain only one directory (actual type is not directory)");
      endResponseWithError(res, err);
      clean(dstPath, extractedDirPath);
    }

    common.log("Artifacts extracted into: ".concat(extractedDirPath)); // Compile content
    // TODO
    // Archive folder with resulted compilation artifacts

    var directoryToTar = compilationArtifactFolder;
    createTar(directoryToTar, extractedDirPath, exid).then(tarPath => {
      common.log("Compile artifact tar created: ".concat(tarPath)); // Base64 encode

      var buffer = fs.readFileSync(tarPath);
      var base64data = buffer.toString("base64");
      common.log("Compile artifact tar base64 computed (len: ".concat(base64data.length, "): ").concat(base64data)); // Send the archive back to the requestor

      commands.addRequiredHeadersToCommandResponse(res, exid);
      res.statusCode = common.communication.statusCodes.OK;
      res.statusMessage = "Ok";
      res.setHeader("Content-Type", "text/plain");
      common.log("Sending response back to client...");
      res.write(base64data, "utf-8", err => {
        if (err) {
          common.error("An error occurred while trying to send the result back to client: ".concat(err));
          clean(dstPath, extractedDirPath);
          return;
        }

        res.end(() => {
          common.log("Response successfully transmitted :)");
          clean(dstPath, extractedDirPath);
        });
      });
    }).catch(err => {
      // Catch createTar
      endResponseWithError(res, err);
      clean(dstPath, extractedDirPath);
    });
  }).catch(err => {
    // Catch untar
    endResponseWithError(res, err);
    clean(dstPath, extractedDirPath);
  });
}

function clean(tarPath, extractedDirPath) {
  if (!cleanAfter) {
    return;
  }

  if (tarPath && fs.existsSync(tarPath)) {
    common.filesystem.deleteFile(tarPath);
    common.log("File ".concat(tarPath, " deleted"));
  }

  if (extractedDirPath && fs.existsSync(extractedDirPath)) {
    // Since this folder also contains the tar created to send back
    // to the client, that resource will be cleared too
    common.filesystem.deleteDirectory(extractedDirPath).then(() => {
      common.log("Directory ".concat(extractedDirPath, " deleted"));
    }).catch(err => {
      common.warn("Error while cleaning up. Could not remove directory ".concat(extractedDirPath, ": '").concat(err, "'"));
    });
  }
}

function checkRequest(req) {
  if (req.method !== "POST") {
    common.error("Command ".concat(commands.COMMAND_COMPILE, " requires a POST, received a ").concat(req.method));
    return false;
  }

  return true;
}

function createTar(_x, _x2) {
  return _createTar.apply(this, arguments);
}

function _createTar() {
  _createTar = _asyncToGenerator(function* (dirpath, dstDir) {
    var exid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var tarFileName = "".concat(consts.COMPILE_ARTIFACTS_TAR_FILE_PREFIX, "-").concat(exid || common.generateId(true));
    var tarPath = yield common.filesystem.tarFolder(dirpath, dstDir, tarFileName);

    if (path.join(dstDir, "".concat(tarFileName, ".tgz")) !== tarPath) {
      throw new Error("Created tar ".concat(tarPath, " was supposed to be in ").concat(dstDir, "."));
    }

    return tarPath;
  });
  return _createTar.apply(this, arguments);
}

function untar(_x3, _x4) {
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

function endResponseWithError(res, err) {
  var errorMsg = "An error occurred while processing the request: ".concat(err);
  common.error(errorMsg);
  res.statusCode = common.communication.statusCodes.SRV_ERROR;
  res.statusMessage = errorMsg;
  res.end();
}