/**
 * application.js
 * Andrea Tino - 2020
 * 
 * Application specific settings and utilities.
 */

const fs = require("fs");
const path = require("path");

/** The name of the product directory. */
export const DIR_NAME = "librars";

/**
 * Gets the application data folder.
 */
export function getDataFolder() {
    const dataDir = process.env.APPDATA;
    if (!dataDir) {
        throw new Error("Could not retrieve user data folder");
    }

    return dataDir;
}

/**
 * Makes sure that the data folder is created.
 * 
 * @returns {string} The (normalized) path to the data folder.
 */
export function ensureDataDir() {
    const dataDir = getDataFolder();
    const dir = path.join(dataDir, DIR_NAME);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);

        if (!fs.existsSync(dir)) {
            throw new Error(`Could not create dir ${dir}`);
        }
    }

    return path.normalize(dir);
}
