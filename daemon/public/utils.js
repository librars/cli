"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDataFolder = getDataFolder;
exports.log = log;
exports.warn = warn;
exports.error = error;
exports.addVersionHTTPHeaders = addVersionHTTPHeaders;
exports.getVersionFromHTTPHeaders = getVersionFromHTTPHeaders;

/**
 * utils.js
 * Andrea Tino - 2020
 * 
 * Utilities.
 */
var consts = require("./consts");
/**
 * Gets the Data folder.
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
  console.warn(msg);
}
/**
 * Logs an error.
 * 
 * @param {string} msg The message to log.
 */


function error(msg) {
  console.error(msg);
}
/**
 * Ensures the version headers are added.
 * 
 * @param {any} headers The header object to which adding the version headers.
 */


function addVersionHTTPHeaders(headers) {
  var version = getVersionFromHTTPHeaders(headers);

  if (version) {
    throw new Error("Header ".concat(consts.VERSION_HEADER_NAME, " already present: ").concat(version));
  }

  headers[consts.VERSION_HEADER_NAME] = version.VERSION;
}
/**
 * Extract the version header value.
 * 
 * @param {any} headers The header object to which adding the version headers.
 * @returns {string} The version, null if not found.
 */


function getVersionFromHTTPHeaders(headers) {
  if (!headers[consts.VERSION_HEADER_NAME] || headers[consts.VERSION_HEADER_NAME].length === 0) {
    return null;
  }

  return headers[consts.VERSION_HEADER_NAME];
}