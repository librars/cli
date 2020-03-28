/**
 * compile.js
 * Andrea Tino - 2020
 * 
 * Executes a compile command.
 */

const fs = require("fs");
const path = require("path");
const http = require("http");

const utils = require("./utils");
const commands = require("./commands");
const operations = require("./operations");

/**
 * Compiles a book.
 * 
 * @param {any} serverinfo The server info object.
 * @param {string} dirpath The path to the directory containing the book to compile. 
 */
export async function compile(serverinfo, dirpath) {
    if (!serverinfo) {
        throw new Error("Argument serverinfo canot be null or undefined");
    }
    if (!dirpath) {
        throw new Error("Argument dirpath canot be null or undefined");
    }

    if (!fs.existsSync(dirpath)) {
        throw new Error(`dirpath ${dirpath} could not be found`);
    }
    if (!fs.statSync(dirpath).isDirectory) {
        throw new Error(`Path ${dirpath} does not point to a directory`);
    }

    // Generate a zip
    const dstDir = utils.ensureDataDir();
    const zipFileName = `zip-${utils.generateId(true)}`;
    const zipPath = await operations.zipFolder(dirpath, dstDir, zipFileName);

    if (path.join(dstDir, `${zipFileName}.zip`) !== zipPath) {
        throw new Error(`Created zip ${zipPath} was supposed to be in ${dstDir}.`);
    }

    /*http.get(commands.buildCommandUrl(serverinfo), (res) => {
        let data = "";

        res.on("data", (chunk) => {
            data += chunk;
        });

        res.on("end", () => {
            utils.log(JSON.parse(data).explanation);
        });
    }).on("error", (err) => {
        utils.error(`An error occurred while processing command 'compile': ${err}`);
    });*/
}
