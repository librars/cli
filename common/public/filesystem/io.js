"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteFile = deleteFile;
exports.deleteDirectory = deleteDirectory;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * io.js
 * Andrea Tino - 2020
 * 
 * I/O operations on files and directories.
 */
var fs = require("fs");

var rimraf = require("rimraf");
/**
 * Safely deletes a file.
 * 
 * @param {string} filepath Path to the file to delete.
 */


function deleteFile(filepath) {
  if (!fs.existsSync(filepath) || !fs.statSync(filepath).isFile()) {
    return;
  }

  fs.unlinkSync(filepath);
}
/**
 * Safely deletes a direcory.
 * 
 * @param {string} dirpath Path to the directory to delete.
 * @async
 */


function deleteDirectory(_x) {
  return _deleteDirectory.apply(this, arguments);
}

function _deleteDirectory() {
  _deleteDirectory = _asyncToGenerator(function* (dirpath) {
    if (!fs.existsSync(dirpath) || !fs.statSync(dirpath).isDirectory()) {
      return;
    }

    return new Promise((resolve, reject) => {
      rimraf(dirpath, err => {
        if (!err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  });
  return _deleteDirectory.apply(this, arguments);
}