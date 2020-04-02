"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteFile = deleteFile;
exports.deleteDirectory = deleteDirectory;

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
 */


function deleteDirectory(dirpath) {
  if (!fs.existsSync(dirpath) || !fs.statSync(dirpath).isDirectory()) {
    return;
  }

  rimraf.sync(dirpath);
}