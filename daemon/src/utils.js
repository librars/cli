/**
 * utils.js
 * Andrea Tino - 2020
 * 
 * Utilities.
 */

const consts = require("./consts");

/**
 * Gets the Data folder.
 */
export function getDataFolder() {
    const dataDir = process.env.APPDATA;
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

/**
 * Ensures the version headers are added.
 * 
 * @param {any} headers The header object to which adding the version headers.
 */
export function addVersionHTTPHeaders(headers) {
    const version = getVersionFromHTTPHeaders(headers);

    if (version) {
        throw new Error(`Header ${consts.VERSION_HEADER_NAME} already present: ${version}`);
    }

    headers[consts.VERSION_HEADER_NAME] = version.VERSION;
}

/**
 * Extract the version header value.
 * 
 * @param {any} headers The header object to which adding the version headers.
 * @returns {string} The version, null if not found.
 */
export function getVersionFromHTTPHeaders(headers) {
    if (!headers[consts.VERSION_HEADER_NAME] || headers[consts.VERSION_HEADER_NAME].length === 0) {
        return null;
    }

    return headers[consts.VERSION_HEADER_NAME];
}
