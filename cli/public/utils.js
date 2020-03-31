"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteFile = deleteFile;

/**
 * utils.js
 * Andrea Tino - 2020
 * 
 * Utilities.
 */
var fs = require("fs");
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