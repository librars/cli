/**
 * io.js
 * Andrea Tino - 2020
 * 
 * I/O operations on files and directories.
 */

const fs = require("fs");
const rimraf = require("rimraf");

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
 * Safely deletes a direcory.
 * 
 * @param {string} dirpath Path to the directory to delete.
 */
export function deleteDirectory(dirpath) {
    if (!fs.existsSync(dirpath) || !fs.statSync(dirpath).isDirectory()) {
        return;
    }

    rimraf.sync(dirpath);
}
