/**
 * operations.js
 * Andrea Tino - 2020
 * 
 * Operations.
 */

const fs = require("fs");
const path = require("path");
const zip = require("archiver");

const utils = require("./utils");

/**
 * Generates a zip archive of a folder.
 * 
 * @param {string} src The path to the directory to zip.
 * @param {string} dst The path to the directory where the zip will be saved.
 * @param {string} name The name to assign to the generated zip (not inclusive of extension).
 * @returns {string} The path pointing to the newly created zip.
 */
export async function zipFolder(src, dst, name) {
    const dstZipPath = path.join(path.normalize(dst), `${name}.zip`);
    const output = fs.createWriteStream(dstZipPath); // Prepare destination
    const archive = zip("zip"); // Create a new zip archive

    output.on("close", () => {
        utils.log(`${archive.pointer()} total bytes written.`);
    });

    archive.on("error", (err) => {
        utils.error(`An error occurred while zipping ${src}: ${err}.`);
        throw err; // Display stack
    });

    // Initiate zip creation
    archive.pipe(output);

    // Add directory into the archive
    archive.directory(src, "stuff");

    // Commit
    await archive.finalize();
    
    return dstZipPath;
}
