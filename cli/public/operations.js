"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tarFolder = tarFolder;
exports.untarFolder = untarFolder;

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

var tar = require("tar");
/**
 * Generates a tar archive of a folder.
 * 
 * @param {string} src The path to the directory to tar.
 * @param {string} dst The path to the directory where the tar will be saved.
 * @param {string} name The name to assign to the generated tar (not inclusive of extension).
 * @returns {string} The path pointing to the newly created tar.
 * @async
 */


function tarFolder(_x, _x2, _x3) {
  return _tarFolder.apply(this, arguments);
}
/**
 * Extracts a tar archive.
 * 
 * @param {string} src The path to the archive to untar.
 * @param {string} dst The path to the directory where the tar (extracted) content will be saved.
 * @returns {string} The path pointing to the newly created folder containing the (extracted) tar content.
 * @async
 */


function _tarFolder() {
  _tarFolder = _asyncToGenerator(function* (src, dst, name) {
    var dstTarPath = path.join(path.normalize(dst), "".concat(name, ".tgz"));
    var normalizedSrc = path.normalize(src);
    var srcDirName = path.dirname(normalizedSrc);
    var srcFolderName = path.basename(normalizedSrc);
    var options = {
      gzip: true,
      cwd: srcDirName
    };
    return new Promise((resolve, reject) => {
      var stream = tar.c(options, [srcFolderName]);
      stream.pipe(fs.createWriteStream(dstTarPath));
      stream.on("finish", () => {
        resolve(dstTarPath);
      });
      stream.on("error", err => {
        reject(err);
      });
    });
  });
  return _tarFolder.apply(this, arguments);
}

function untarFolder(_x4, _x5) {
  return _untarFolder.apply(this, arguments);
}

function _untarFolder() {
  _untarFolder = _asyncToGenerator(function* (src, dst) {
    var normalizedSrc = path.normalize(src);
    var normalizedDst = path.normalize(dst);
    return new Promise((resolve, reject) => {
      var stream = fs.createReadStream(normalizedSrc);
      stream.pipe(tar.x(normalizedDst));
      stream.on("finish", () => {
        resolve(normalizedDst);
      });
      stream.on("error", err => {
        reject(err);
      });
    });
  });
  return _untarFolder.apply(this, arguments);
}