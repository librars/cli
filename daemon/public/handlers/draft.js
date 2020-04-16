"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleDraft = handleDraft;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * draft.js
 * Andrea Tino - 2020
 * 
 * Handles a draft request.
 */
var fs = require("fs");

var path = require("path");

var common = require("@librars/cli-common");

var commands = require("../commands");

var consts = require("../consts");

var api = require("../api");

var utils = require("../utils"); // Configuration


var cleanAfter = true;
var moveToTrash = true; // If false, it will permanently delete intermediate resources

/**
 * Handles the request.
 * 
 * @param {any} req The request object.
 * @param {any} res The response object.
 */

function handleDraft(req, res) {
  common.log("Handling command ".concat(commands.COMMAND_DRAFT, "..."));

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

  common.log("Request has been successfully received"); // Get the request, expecting a JSON object: '{ "template_name": "<value>" }'

  var parsedReqBody = utils.parseJsonString(reqBody);

  if (!checkExpectedRequestBody(parsedReqBody)) {
    endResponseWithError(res, "Invalid request body received: '".concat(reqBody, "'. Parsing failed"));
    clean();
    return;
  } // Get the template name (guaranteed to exist and valid value at this point due to check before)


  var templateName = parsedReqBody["template_name"]; // TODO: create a message format in common
  // Create a new directory to host the draft documents

  var dstDir = path.join(path.normalize(common.getDataFolder()), common.DIR_NAME);
  var draftArtifactFolder = path.join(dstDir, "".concat(consts.DRAFT_DIR_PREFIX, "-").concat(exid));
  fs.mkdirSync(draftArtifactFolder); // Get draft artifacts

  common.log("Draft artifacts for template '".concat(templateName, "' will be retrieved and saved into: '").concat(draftArtifactFolder, "'..."));
  api.invoke(api.API.draft, templateName, draftArtifactFolder).then(apiResult => {
    common.log("Draft artifacts retrieval completed: '".concat(JSON.stringify(apiResult), "'")); // Archive folder with draft artifacts

    var directoryToTar = draftArtifactFolder;
    createTar(directoryToTar, dstDir, exid).then(tarPath => {
      common.log("Draft artifact tar created: ".concat(tarPath)); // Base64 encode

      var buffer = fs.readFileSync(tarPath);
      var base64data = buffer.toString("base64");
      common.log("Draft artifact tar base64 computed (len: ".concat(base64data.length, "): ").concat(base64data)); // Send the archive back to the requestor

      commands.addRequiredHeadersToCommandResponse(res, exid);
      res.statusCode = common.communication.statusCodes.OK;
      res.statusMessage = "Ok";
      res.setHeader("Content-Type", "text/plain");
      common.log("Sending response back to client...");
      res.write(base64data, "utf-8", err => {
        if (err) {
          common.error("An error occurred while trying to send the result back to client: ".concat(err));
          clean(draftArtifactFolder, tarPath);
          return;
        }

        res.end(() => {
          common.log("Response successfully transmitted :)");
          clean(draftArtifactFolder, tarPath);
        });
      });
    }).catch(err => {
      // Catch createTar
      endResponseWithError(res, err);
      clean(draftArtifactFolder);
    });
  }).catch(err => {
    // Catch API invocation
    endResponseWithError(res, err);
    clean(draftArtifactFolder);
  }); // API invocation
}

function clean(draftArtifactFolder, tarPath) {
  if (!cleanAfter) {
    return;
  }

  var disposeFile = p => {
    if (moveToTrash) {
      common.log("File ".concat(p, " moved to trash")); // TODO

      return;
    }

    common.filesystem.deleteFile(p);
    common.log("File ".concat(p, " deleted"));
  };

  var disposeDir = p => {
    if (moveToTrash) {
      common.log("Directory ".concat(p, " moved to trash")); // TODO

      return;
    }

    common.filesystem.deleteDirectory(p);
    common.log("Directory ".concat(p, " deleted"));
  };

  if (draftArtifactFolder && fs.existsSync(draftArtifactFolder)) {
    // Since this folder also contains the tar created to send back
    // to the client, that resource will be cleared too
    disposeDir(draftArtifactFolder);
  }

  if (tarPath && fs.existsSync(tarPath)) {
    disposeFile(tarPath);
  }
}

function checkRequest(req) {
  if (req.method !== "POST") {
    common.error("Command ".concat(commands.COMMAND_DRAFT, " requires a POST, received a ").concat(req.method));
    return false;
  }

  return true;
}

function checkExpectedRequestBody(parsedReqBody) {
  if (!parsedReqBody) {
    return false;
  }

  if (!parsedReqBody["template_name"]) {
    return false;
  }

  if (parsedReqBody["template_name"].length === 0) {
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
    var tarFileName = "".concat(consts.DRAFT_ARTIFACTS_TAR_FILE_PREFIX, "-").concat(exid || common.generateId(true));
    var tarPath = yield common.filesystem.tarFolder(dirpath, dstDir, tarFileName);

    if (path.join(dstDir, "".concat(tarFileName, ".tgz")) !== tarPath) {
      throw new Error("Created tar ".concat(tarPath, " was supposed to be in ").concat(dstDir, "."));
    }

    return tarPath;
  });
  return _createTar.apply(this, arguments);
}

function endResponseWithError(res, err) {
  var errorMsg = "An error occurred while processing the request: ".concat(err);
  common.error(errorMsg);
  res.statusCode = common.communication.statusCodes.SRV_ERROR;
  res.statusMessage = errorMsg;
  res.end();
}