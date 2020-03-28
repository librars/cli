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

const consts = require("./consts");

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
 * @param {string} dirpath The path to the directory.
 * @returns {Array} An array of file paths relative to path.
 */
// eslint-disable-next-line no-unused-vars
export function getAllFIlesInDirRecursively(dirpath) {
    // Depth first recursion
    const readdirSync = (p, filelist = []) => {
        if (fs.statSync(p).isDirectory()) {
            fs.readdirSync(p).map(f => readdirSync(filelist[filelist.push(path.join(p, f)) - 1], filelist));
        }
            
        return filelist;
    };

    return readdirSync(dirpath);
}

/**
 * Safely deletes a file.
 * 
 * @param {string} filepath Path to the file to delete.
 */
export function deleteFile(filepath) {
    if (!fs.existsSync(filepath) || !fs.statSync(filepath).isFile()) {
        return;
    }

    fs.unlinkSync(filepath);
}

/**
 * Makes sure that the data folder is created.
 * 
 * @returns {string} The path to the data folder.
 */
export function ensureDataDir() {
    const dataDir = getDataFolder();
    const dir = path.join(dataDir, consts.DIR_NAME);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);

        if (!fs.existsSync(dir)) {
            throw new Error(`Could not create dir ${dir}`);
        }
    }

    return path.normalize(dir);
}

function getCurrentTimestampAsId() {
    const pad = (x) => x.length > 1 ? `0${x}` : `${x}`;

    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; // Months range in 0-11
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    const seconds = dateObj.getUTCSeconds();
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();

    return `${year}${pad(month)}${pad(day)}T${pad(hours)}${pad(minutes)}${pad(seconds)}`;
}
