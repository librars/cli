"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDataFolder = getDataFolder;
exports.log = log;
exports.warn = warn;
exports.error = error;

/**
 * utils.js
 * Andrea Tino - 2020
 * 
 * Utilities.
 */
var chalk = require("chalk");
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