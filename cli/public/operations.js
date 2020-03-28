"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zipFolder = zipFolder;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * operations.js
 * Andrea Tino - 2020
 * 
 * Operations.
 */
var fs = require("fs");

var path = require("path");

var zip = require("archiver");

var utils = require("./utils");

var consts = require("./consts");
/**
 * Generates a zip archive of a folder.
 * 
 * @param {string} src The path to the directory to zip.
 * @param {string} dst The path to the directory where the zip will be saved.
 * @param {string} name The name to assign to the generated zip (not inclusive of extension).
 * @returns {string} The path pointing to the newly created zip.
 */


function zipFolder(_x, _x2, _x3) {
  return _zipFolder.apply(this, arguments);
}

function _zipFolder() {
  _zipFolder = _asyncToGenerator(function* (src, dst, name) {
    var dstZipPath = path.join(path.normalize(dst), "".concat(name, ".zip"));
    var output = fs.createWriteStream(dstZipPath); // Prepare destination

    var archive = zip("zip"); // Create a new zip archive

    output.on("close", () => {
      utils.log("".concat(archive.pointer(), " total bytes written."));
    });
    archive.on("error", err => {
      utils.error("An error occurred while zipping ".concat(src, ": ").concat(err, "."));
      throw err; // Display stack
    }); // Initiate zip creation

    archive.pipe(output); // Add directory into the archive

    archive.directory(src, consts.ZIP_INNER_FOLDER_NAME); // Commit

    yield archive.finalize();
    return dstZipPath;
  });
  return _zipFolder.apply(this, arguments);
}