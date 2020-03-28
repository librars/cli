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
export function zipFolder(src, dst, name) {
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

    // Get all the files to add to the archive
    const files = utils.getAllFIlesInDirRecursively(src);
    console.log(`Found ${files.length} files to zip.`);

    // Add files into the archive
    for (let i = 0; i < files.length; i++) {
        archive.append(fs.createReadStream(files[i])/*, { name: "file1.txt" }*/);
    }
    archive.finalize();
    
    return dstZipPath;
}
