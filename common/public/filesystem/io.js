"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteFile = deleteFile;
exports.deleteDirectory = deleteDirectory;
exports.ensureDirectory = ensureDirectory;

/**
 * io.js
 * Andrea Tino - 2020
 * 
 * I/O operations on files and directories.
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
/**
 * Safely deletes a direcory.
 * 
 * @param {string} dirpath Path to the directory to delete.
 */


function deleteDirectory(dirpath) {
  if (!fs.existsSync(dirpath) || !fs.statSync(dirpath).isDirectory()) {
    return;
  } // Depth first recursive deletion


  var deleteFolderRecursive = d => {
    if (fs.existsSync(d)) {
      fs.readdirSync(d).forEach((file, index) => {
        var curPath = path.join(d, file);

        if (fs.lstatSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath);
        } else {
          fs.unlinkSync(curPath); // Remove each file one by one
        }
      });
      fs.rmdirSync(d); // Safe to delete folder as now empty
    }
  };

  deleteFolderRecursive(dirpath);
}
/**
 * Makes sure a directory is created. If already present, nothing happens.
 * 
 * @param {string} dirpath Path to directory to ensure.
 * @returns {boolean} True if a directory was created, false if already present.
 */


function ensureDirectory(dirpath) {
  if (fs.existsSync(dirpath)) {
    return false;
  }

  fs.mkdirSync(dirpath);
  return true;
}