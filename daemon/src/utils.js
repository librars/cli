/**
 * utils.js
 * Andrea Tino - 2020
 * 
 * Utilities.
 */

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
