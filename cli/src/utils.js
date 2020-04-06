/**
 * utils.js
 * Andrea Tino - 2020
 * 
 * Utilities.
 */

const fs = require("fs");

/**
 * Moves a resource (file or directory) to the trash folder.
 * 
 * @param {string} resourcePath The path to the resource to move to trash.
 * @returns {stirng} The path to the trash folder whee the resource has been moved. Null if no move was performed.
 */
export function moveToTrash(resourcePath) {
    if (!fs.existsSync(resourcePath)) {
        return null;
    }

    // TODO
}
