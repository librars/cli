/**
 * utils.js
 * Andrea Tino - 2020
 * 
 * Utilities.
 */

const chalk = require("chalk");
const uuidv4 = require("uuid").v4;
const fs = require("fs");
const path = require('path');

/**
 * Gets the HOME folder.
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

/**
 * Generates a unique ID.
 * 
 * @param {boolean} withTimestamp A value indicating whether the id should include the timestamp.
 * @returns {string} The unique ID.
 */
export function generateId(withTimestamp) {
    withTimestamp = withTimestamp || false;

    const id = uuidv4();

    return withTimestamp ? `${getCurrentTimestampAsId()}_${id}` : `${id}`;
}

/**
 * Gets a list of all files in a directory and its subdirectories.
 * 
 * @param {string} path The path to the directory.
 * @returns {Array} An array of file paths relative to path.
 */
export function getAllFIlesInDirRecursively(path) {
    // Depth first recursion
    const readdirSync = (p, filelist = []) => {
        if (fs.statSync(p).isDirectory()) {
            fs.readdirSync(p).map(f => readdirSync(filelist[filelist.push(path.join(p, f)) - 1], filelist));
        }
            
        return filelist;
    }

    return readdirSync(path);
}

function getCurrentTimestampAsId() {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; // Months range in 0-11
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    newdate = `${year}${month}${day}`;
}
