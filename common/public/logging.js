"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = log;
exports.warn = warn;
exports.error = error;

/**
 * logging.js
 * Andrea Tino - 2020
 * 
 * Logging functions.
 */
var chalk = require("chalk");
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