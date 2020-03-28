"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDataFolder = getDataFolder;
exports.log = log;
exports.warn = warn;
exports.error = error;
exports.generateId = generateId;
exports.getAllFIlesInDirRecursively = getAllFIlesInDirRecursively;
exports.deleteFile = deleteFile;
exports.ensureDataDir = ensureDataDir;

/**
 * utils.js
 * Andrea Tino - 2020
 * 
 * Utilities.
 */
var chalk = require("chalk");

var uuidv4 = require("uuid").v4;

var fs = require("fs");

var path = require('path');

var consts = require("./consts");
/**
 * Gets the HOME folder.
 */


function getDataFolder() {
  var dataDir = process.env.APPDATA;

  if (!dataDir) {
    throw new Error("Could not retrieve user data folder");
  }

  return dataDir;
}
/**
 * Logs an info.
 * 
 * @param {string} msg The message to log.
 */


function log(msg) {
  console.log(msg);
}
/**
 * Logs a warning.
 * 
 * @param {string} msg The message to log.
 */


function warn(msg) {
  console.warn(chalk.yellow(msg));
}
/**
 * Logs an error.
 * 
 * @param {string} msg The message to log.
 */


function error(msg) {
  console.error(chalk.red(msg));
}
/**
 * Generates a unique ID.
 * 
 * @param {boolean} withTimestamp A value indicating whether the id should include the timestamp.
 * @returns {string} The unique ID.
 */


function generateId(withTimestamp) {
  withTimestamp = withTimestamp || false;
  var id = uuidv4();
  return withTimestamp ? "".concat(getCurrentTimestampAsId(), "_").concat(id) : "".concat(id);
}
/**
 * Gets a list of all files in a directory and its subdirectories.
 * 
 * @param {string} dirpath The path to the directory.
 * @returns {Array} An array of file paths relative to path.
 */
// eslint-disable-next-line no-unused-vars


function getAllFIlesInDirRecursively(dirpath) {
  // Depth first recursion
  var readdirSync = function readdirSync(p) {
    var filelist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (fs.statSync(p).isDirectory()) {
      fs.readdirSync(p).map(f => readdirSync(filelist[filelist.push(path.join(p, f)) - 1], filelist));
    }

    return filelist;
  };

  return readdirSync(dirpath);
}
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
 * Makes sure that the data folder is created.
 * 
 * @returns {string} The path to the data folder.
 */


function ensureDataDir() {
  var dataDir = getDataFolder();
  var dir = path.join(dataDir, consts.DIR_NAME);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);

    if (!fs.existsSync(dir)) {
      throw new Error("Could not create dir ".concat(dir));
    }
  }

  return path.normalize(dir);
}

function getCurrentTimestampAsId() {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; // Months range in 0-11

  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  return "".concat(year).concat(month).concat(day);
}