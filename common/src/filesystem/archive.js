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
 * Expects the archive to contain a single folder, otherwise it will throw an error.
 * It will untar the content inside folder @param {dst}.
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
        // First check the content
        const tarContent = getTarContent(normalizedSrc);
        const tarRootDirName = getFilesSameRootDir(tarContent);
        if (!tarRootDirName) {
            reject("Archive is malformed: root container folder not present");
        }

        const stream = extractTarContent(normalizedSrc, normalizedDst);

        stream.on("end", () => {
            resolve(normalizedDst);
        });

        stream.on("error", (err) => {
            reject(err);
        });
    });
}

function extractTarContent(src, dst) {
    return fs.createReadStream(src)
        .pipe(tar.x({
            cwd: dst
        }));
}

function getFilesSameRootDir(fileList) {
    let rootDirs = [];

    for (let i = 0; i < fileList.length; i++) {
        const fileRootDir = getRootDir(fileList[i]);

        if (fileRootDir === ".") {
            // All files are expected to be in a container folder
            return null;
        }

        if (rootDirs.indexOf(fileRootDir) === -1) {
            rootDirs.push(fileRootDir);
        }
    }

    return rootDirs.length === 1 ? rootDirs[0] : null;
}

function getTarContent(tarPath) {
    let fileList = [];

    tar.t({
        file: tarPath,
        sync: true,
        filter: (path, entry) => entry.type === "File",
        onentry: (entry) => fileList.push(entry.path)
    });

    return fileList; // Return only file entries with their path relative to the archive content
}

function getRootDir(p) {
    if (p === ".") {
        return p;
    }

    const dirname = path.dirname(p); // The parent, container, directory

    if (dirname === ".") {
        return p;
    }

    return getRootDir(path.dirname(p));
}
