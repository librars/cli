"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDataFolder = getDataFolder;
exports.ensureDataDir = ensureDataDir;
exports.DIR_NAME = void 0;

/**
 * application.js
 * Andrea Tino - 2020
 * 
 * Application specific settings and utilities.
 */
var fs = require("fs");

var path = require("path");
/** The name of the product directory. */


var DIR_NAME = "librars";
/**
 * Gets the application data folder.
 */

exports.DIR_NAME = DIR_NAME;

function getDataFolder() {
  var dataDir = process.env.APPDATA;

  if (!dataDir) {
    throw new Error("Could not retrieve user data folder");
  }

  return dataDir;
}
/**
 * Makes sure that the data folder is created.
 * 
 * @returns {string} The (normalized) path to the data folder.
 */


function ensureDataDir() {
  var dataDir = getDataFolder();
  var dir = path.join(dataDir, DIR_NAME);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);

    if (!fs.existsSync(dir)) {
      throw new Error("Could not create dir ".concat(dir));
    }
  }

  return path.normalize(dir);
}