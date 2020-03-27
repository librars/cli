/**
 * utils.js
 * Andrea Tino - 2020
 * 
 * Utilities.
 */

/**
 * Gets the HOME folder.
 */
export function getHomeFolder() {
    return process.env.HOME;
}

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
    console.warn(msg);
}

/**
 * Logs an error.
 * 
 * @param {string} msg The message to log.
 */
export function error(msg) {
    console.error(msg);
}
