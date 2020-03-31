/**
 * utils.js
 * Andrea Tino - 2020
 * 
 * Utilities.
 */

const fs = require("fs");

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
