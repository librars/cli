/**
 * archive.js
 * Andrea Tino - 2020
 * 
 * Handling archives.
 */

const fs = require("fs");
const path = require("path");
const tar = require("tar");

/**
 * Generates a tar archive of a folder.
 * 
 * @param {string} src The path to the directory to tar.
 * @param {string} dst The path to the directory where the tar will be saved.
 * @param {string} name The name to assign to the generated tar (not inclusive of extension).
 * @returns {string} The path pointing to the newly created tar.
 * @async
 */
export async function tarFolder(src, dst, name) {
    const dstTarPath = path.join(path.normalize(dst), `${name}.tgz`);
    const normalizedSrc = path.normalize(src);
    const srcDirName = path.dirname(normalizedSrc);
    const srcFolderName = path.basename(normalizedSrc);

    const options = {
        gzip: true,
        cwd: srcDirName
    };

    return new Promise((resolve, reject) => {
        const stream = tar.c(options, [srcFolderName]);
        stream.pipe(fs.createWriteStream(dstTarPath));

        stream.on("finish", () => {
            resolve(dstTarPath);
        });

        stream.on("error", (err) => {
            reject(err);
        });
    });
}

/**
 * Extracts a tar archive.
 * 
 * @param {string} src The path to the archive to untar.
 * @param {string} dst The path to the directory where the tar (extracted) content will be saved.
 * @returns {string} The path pointing to the newly created folder containing the (extracted) tar content.
 * @async
 */
export async function untarFolder(src, dst) {
    const normalizedSrc = path.normalize(src);
    const normalizedDst = path.normalize(dst);
    
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(normalizedSrc);
        stream.pipe(tar.x(normalizedDst));

        stream.on("finish", () => {
            resolve(normalizedDst);
        });

        stream.on("error", (err) => {
            reject(err);
        });
    });
}
