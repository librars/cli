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
  compile: "COMPILE"
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

    switch (api) {
      case API.compile:
        for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          params[_key - 1] = arguments[_key];
        }

        result = yield invokeCompile(params);
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
      var cmd = spawn(path2rscript, [path.normalize(path.join(__dirname, "..", "api", "compile.R")), compileDirPath]);
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
          reject("Compile exited with code ".concat(exitCode, ". Errors: ").concat(buffer.err));
          return;
        }

        resolve("Compile exited with code ".concat(exitCode, ". Output: ").concat(buffer.out));
      };

      cmd.on("close", code => {
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
  return _invokeCompile.apply(this, arguments);
}