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
 * 
 * This folder is the system data folder.
 * 
 * @returns {string} The (normalized) path to the system data folder.
 */
export function getDataFolder() {
    const dataDir = process.env.APPDATA;
    if (!dataDir) {
        throw new Error("Could not retrieve user data folder");
    }

    return path.normalize(dataDir);
}

/**
 * Gets the content of a file located inside the application data dir.
 * 
 * @param {string} filename The name (extension included) of the file to look for.
 * @returns {string} The utf-8 encoded content. Null if the file was not found.
 */
export function getContentFromFileInDataFolder(filename) {
    const dataDir = getDataFolder();
    const dir = path.join(dataDir, DIR_NAME);

    if (fs.existsSync(dir)) {
        const filePath = path.join(dir, filename);

        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, { encoding: "utf-8" });

            if (content) {
                return content;
            }
        }
    }

    return null;
}

/**
 * Makes sure that the application data folder is created.
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
