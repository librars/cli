/**
 * compile.js
 * Andrea Tino - 2020
 * 
 * Executes a compile command.
 */

const http = require("http");

const utils = require("./utils");
const commands = require("./commands");
const operations = require("./operations");

/**
 * Compiles a book.
 * 
 * @param {any} serverinfo The server info object.
 * @param {string} path The path to the directory containing the book to compile. 
 */
export function compile(serverinfo, path) {
    if (!path) {
        throw new Error("Argument path canot be null or undefined");
    }

    // Generate a zip
    const dstDir = utils.getDataFolder();
    const zipFileName = `zip-${utils.generateId(true)}`;
    const zipPath = operations.zipFolder(path, dstDir, zipFileName);

    if (dstDir !== zipPath) {
        throw new Error(`Created zip ${zipPath} was supposed to be in ${dstDir}.`);
    }

    http.get(commands.buildCommandUrl(serverinfo), (res) => {
        let data = "";

        res.on("data", (chunk) => {
            data += chunk;
        });

        res.on("end", () => {
            utils.log(JSON.parse(data).explanation);
        });
    }).on("error", (err) => {
        utils.error(`An error occurred while processing command 'compile': ${err}`);
    });
}
