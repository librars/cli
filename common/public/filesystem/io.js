"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteFile = deleteFile;
exports.deleteDirectory = deleteDirectory;
exports.moveFiles = moveFiles;
exports.copyFiles = copyFiles;
exports.ensureDirectory = ensureDirectory;

/**
 * io.js
 * Andrea Tino - 2020
 * 
 * I/O operations on files and directories.
 */
var fs = require("fs");

var path = require("path");
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
 * Safely moves files from a direcory into another.
 * 
 * @param {string} dirpath Path to the directory whose content to move.
 * @param {string} dstdirpath Path to the destination directory (must exist).
 * @param {boolean} rmdir Whether to remove the source (empty) dir structure at the end.
 */


function moveFiles(srcdirpath, dstdirpath) {
  var rmdir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (!fs.existsSync(srcdirpath) || !fs.statSync(srcdirpath).isDirectory()) {
    return;
  }

  if (!fs.existsSync(dstdirpath) || !fs.statSync(dstdirpath).isDirectory()) {
    throw new Error("Destination folder ".concat(dstdirpath, " does not exist or not a directory"));
  } // Depth first recursive move


  var moveFolderRecursive = (d, nd, rm) => {
    if (fs.existsSync(d)) {
      fs.readdirSync(d).forEach((file, index) => {
        var curPath = path.join(d, file);
        var npath = path.join(nd, path.basename(curPath));

        if (fs.lstatSync(curPath).isDirectory()) {
          fs.mkdirSync(npath);
          moveFolderRecursive(curPath, npath, rm);
        } else {
          fs.renameSync(curPath, npath); // Move each file one by one
        }
      });

      if (rm) {
        fs.rmdirSync(d); // Safe to delete folder as now empty
      }
    }
  };

  moveFolderRecursive(srcdirpath, dstdirpath, rmdir);
}
/**
 * Safely copies files from a direcory into another.
 * 
 * @param {string} dirpath Path to the directory whose content to move.
 * @param {string} dstdirpath Path to the destination directory (must exist).
 * @param {(string) => boolean} A function to whitelist files. 
 */


function copyFiles(srcdirpath, dstdirpath, cond) {
  if (!fs.existsSync(srcdirpath) || !fs.statSync(srcdirpath).isDirectory()) {
    return;
  }

  if (!fs.existsSync(dstdirpath) || !fs.statSync(dstdirpath).isDirectory()) {
    throw new Error("Destination folder ".concat(dstdirpath, " does not exist or not a directory"));
  }

  if (!cond) {
    cond = f => true;
  } // Depth first recursive copy


  var copyFolderRecursive = (d, nd) => {
    if (fs.existsSync(d)) {
      fs.readdirSync(d).forEach((file, index) => {
        var curPath = path.join(d, file);

        if (cond(curPath)) {
          // Only if whitelisted
          var npath = path.join(nd, path.basename(curPath));

          if (fs.lstatSync(curPath).isDirectory()) {
            fs.mkdirSync(npath);
            copyFolderRecursive(curPath, npath);
          } else {
            fs.copyFileSync(curPath, npath, fs.constants.COPYFILE_EXCL); // Copy each file one by one
          }
        }
      });
    }
  };

  copyFolderRecursive(srcdirpath, dstdirpath);
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