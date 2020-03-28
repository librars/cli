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

var utils = require("./utils");

var commands = require("./commands");

var operations = require("./operations");
/**
 * Compiles a book.
 * 
 * @param {any} serverinfo The server info object.
 * @param {string} dirpath The path to the directory containing the book to compile. 
 */


function compile(_x, _x2) {
  return _compile.apply(this, arguments);
}

function _compile() {
  _compile = _asyncToGenerator(function* (serverinfo, dirpath) {
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
    } // Generate a zip


    var dstDir = utils.ensureDataDir();
    var zipFileName = "zip-".concat(utils.generateId(true));
    var zipPath = yield operations.zipFolder(dirpath, dstDir, zipFileName);

    if (path.join(dstDir, "".concat(zipFileName, ".zip")) !== zipPath) {
      throw new Error("Created zip ".concat(zipPath, " was supposed to be in ").concat(dstDir, "."));
    }
    /*http.get(commands.buildCommandUrl(serverinfo), (res) => {
        let data = "";
          res.on("data", (chunk) => {
            data += chunk;
        });
          res.on("end", () => {
            utils.log(JSON.parse(data).explanation);
        });
    }).on("error", (err) => {
        utils.error(`An error occurred while processing command 'compile': ${err}`);
    });*/

  });
  return _compile.apply(this, arguments);
}