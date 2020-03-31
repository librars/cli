/**
 * logging.js
 * Andrea Tino - 2020
 * 
 * Logging functions.
 */

const chalk = require("chalk");

/**
 * Logs an info.
 * 
 * @param {string} msg The message to log.
 */
export function log(msg) {
    console.log(msg);
}

/**
 * Logs a warning.
 * 
 * @param {string} msg The message to log.
 */
export function warn(msg) {
    console.warn(chalk.yellow(msg));
}

/**
 * Logs an error.
 * 
 * @param {string} msg The message to log.
 */
export function error(msg) {
    console.error(chalk.red(msg));
}
