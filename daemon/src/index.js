/**
 * index.js
 * Andrea Tino - 2020
 * 
 * Entry file.
 * 
 * How to invoke:
 * node index.js --port <port> --dir <dir>
 */

const http = require("http");
const path = require("path");
const fs = require("fs");
const yargs = require("yargs");

const utils = require("./utils");
const consts = require("./consts");
const commands = require("./commands");
const handleCompile = require("./handlers/compile").handleCompile;

const args = fetchArgs();
const config = {
    // Server listening to this port
    port: args.port | 8080,
    // Directory where dumping received content
    dir: ensureDir(args.dir) // this will make sure the directory exists
};

utils.log(`Server started. Listening on port ${config.port}...`);

// Start the server
http.createServer(function(req, res) {
    handleRequest(req, res);
}).listen(config.port);

function handleRequest(req, res) {
    utils.log(`Request received: ${req.method}, ${req.url}`);

    res.write("Hello there");
    res.end();
}

function fetchArgs() {
    const argv = yargs.argv;

    return {
        port: argv.port | null,
        dir: argv.dir | null
    };
}

function ensureDir(proposedDir) {
    const ensure = (dir, shouldCreate) => {
        if (!fs.existsSync(dir) && shouldCreate) {
            if (!fs.mkdirSync(dir)) {
                throw new Error(`Could not create dir ${dir}`);
            }

            return;
        }

        throw new Error(`Could not find dir ${dir}`);
    };
    const homeDir = utils.getHomeFolder();

    if (proposedDir) {
        ensure(proposedDir, false);
        return path.normalize(proposedDir);
    }

    const dir = path.join(homeDir, consts.DIR_NAME);
    ensure(dir);
    return path.normalize(dir);
}
