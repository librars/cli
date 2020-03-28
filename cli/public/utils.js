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
 * @param {string} path The path to the directory.
 * @returns {Array} An array of file paths relative to path.
 */


function getAllFIlesInDirRecursively(path) {
  // Depth first recursion
  var readdirSync = function readdirSync(p) {
    var filelist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (fs.statSync(p).isDirectory()) {
      fs.readdirSync(p).map(f => readdirSync(filelist[filelist.push(path.join(p, f)) - 1], filelist));
    }

    return filelist;
  };

  return readdirSync(path);
}

function getCurrentTimestampAsId() {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; // Months range in 0-11

  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  newdate = "".concat(year).concat(month).concat(day);
}