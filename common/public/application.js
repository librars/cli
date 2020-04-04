"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDataFolder = getDataFolder;
exports.getContentFromFileInDataFolder = getContentFromFileInDataFolder;
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
 * 
 * This folder is the system data folder.
 * 
 * @returns {string} The (normalized) path to the system data folder.
 */

exports.DIR_NAME = DIR_NAME;

function getDataFolder() {
  var dataDir = process.env.APPDATA;

  if (!dataDir) {
    throw new Error("Could not retrieve user data folder");
  }

  return path.normalize(dataDir);
}
/**
 * Gets the content of a file located inside the application data dir.
 * 
 * @param {string} filename The name (extension included) of the file to look for.
 * @returns {string} The utf-8 encoded content. Null if the file was not found.
 */


function getContentFromFileInDataFolder(filename) {
  var dataDir = getDataFolder();
  var dir = path.join(dataDir, DIR_NAME);

  if (fs.existsSync(dir)) {
    var filePath = path.join(dir, filename);

    if (fs.existsSync(filePath)) {
      var content = fs.readFileSync(filePath, {
        encoding: "utf-8"
      });

      if (content) {
        return content;
      }
    }
  }

  return null;
}
/**
 * Makes sure that the application data folder is created.
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