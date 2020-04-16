"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invoke = invoke;
exports.API = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * api.js
 * Andrea Tino - 2020
 * 
 * API invocation.
 */
var path = require("path");

var fs = require("fs");

var config = require("./config");

var {
  spawn
} = require("child_process");
/** The API available. */


var API = {
  compile: "COMPILE",
  draft: "DRAFT",
  list: "LIST"
};
/**
 * 
 * @param {*} api The API code.
 * @param  {...any} params The parameters to pass.
 */

exports.API = API;

function invoke(_x) {
  return _invoke.apply(this, arguments);
}

function _invoke() {
  _invoke = _asyncToGenerator(function* (api) {
    var result = "";

    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    switch (api) {
      case API.compile:
        result = yield invokeCompile(...params);
        break;

      case API.draft:
        result = yield invokeDraft(...params);
        break;

      case API.list:
        result = yield invokeList(...params);
        break;
    }

    return result;
  });
  return _invoke.apply(this, arguments);
}

function invokeCompile() {
  return _invokeCompile.apply(this, arguments);
}

function _invokeCompile() {
  _invokeCompile = _asyncToGenerator(function* () {
    var compileDirPath = arguments.length <= 0 ? undefined : arguments[0]; // Path to the folder to compile

    if (!compileDirPath) {
      throw new Error("Parameter 'path' cannot be null or undefined");
    }

    return invokeRScript("compile.R", compileDirPath);
  });
  return _invokeCompile.apply(this, arguments);
}

function invokeDraft() {
  return _invokeDraft.apply(this, arguments);
}

function _invokeDraft() {
  _invokeDraft = _asyncToGenerator(function* () {
    var templateName = arguments.length <= 0 ? undefined : arguments[0]; // The name of the template

    var draftArtifactFolder = arguments.length <= 1 ? undefined : arguments[1]; // Path to the folder where to save draft artifacts

    if (!templateName) {
      throw new Error("Parameter 'templateName' cannot be null or undefined");
    }

    if (!draftArtifactFolder) {
      throw new Error("Parameter 'draftArtifactFolder' cannot be null or undefined");
    }

    return invokeRScript("draft.R", templateName, draftArtifactFolder);
  });
  return _invokeDraft.apply(this, arguments);
}

function invokeList() {
  return _invokeList.apply(this, arguments);
}

function _invokeList() {
  _invokeList = _asyncToGenerator(function* () {
    // This API does not expect any parameter
    return invokeRScript("list.R");
  });
  return _invokeList.apply(this, arguments);
}

function invokeRScript(_x2) {
  return _invokeRScript.apply(this, arguments);
}

function _invokeRScript() {
  _invokeRScript = _asyncToGenerator(function* (scriptFileName) {
    for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      params[_key2 - 1] = arguments[_key2];
    }

    var rscriptInfo = config.tryFetchRScriptInfoFromDataDir();

    if (!rscriptInfo) {
      throw new Error("Could not fetch R script info");
    }

    var path2rscript = rscriptInfo.path2rscript;

    if (!path2rscript) {
      throw new Error("Could not find Rscript executable path");
    }

    if (!fs.existsSync(path2rscript) || !fs.statSync(path2rscript).isFile()) {
      throw new Error("Fetched Rscript path '".concat(path2rscript, "' either does not exist or does not point to a file"));
    }

    return new Promise((resolve, reject) => {
      var scriptParams = [path.normalize(path.join(__dirname, "..", "api", scriptFileName))].concat(params);
      var cmd = spawn(path2rscript, scriptParams);
      var buffer = {
        out: "",
        err: ""
      };
      var exitOrCloseRaised = false;
      var exitCode = null;
      cmd.stdout.on("data", data => {
        buffer.out = data;
      });
      cmd.stderr.on("data", data => {
        buffer.err = data;
      });
      cmd.on("error", err => {
        reject(err);
      }); // Make sure to resolve the promise when the process exits
      // and stdio streams have been closed

      var onCompleted = () => {
        if (exitCode !== 0) {
          reject("".concat(scriptFileName, " exited with code ").concat(exitCode, ". Errors: ").concat(buffer.err));
          return;
        }

        resolve({
          msg: "".concat(scriptFileName, " exited with code ").concat(exitCode, ". Output: ").concat(buffer.out),
          value: buffer.out
        });
      };

      cmd.on("close", () => {
        if (!exitOrCloseRaised) {
          exitOrCloseRaised = true;
          return;
        }

        onCompleted();
      });
      cmd.on("exit", code => {
        exitCode = code;

        if (!exitOrCloseRaised) {
          exitOrCloseRaised = true;
          return;
        }

        onCompleted();
      });
    });
  });
  return _invokeRScript.apply(this, arguments);
}