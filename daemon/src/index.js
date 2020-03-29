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
const commandHandlers = {
    compile: require("./handlers/compile").handleCompile,
    unknown: require("./handlers/unknown").handleUnknown
};

const args = fetchArgs();
const config = {
    // Server listening to this port
    port: args.port | 8080,
    // Directory where dumping received content
    dir: ensureDir(args.dir) // this will make sure the directory exists
};

utils.log(`Server started. Listening on port ${config.port}...`);

// Start the server
http.createServer((req, res) => {
    handleRequest(req, res);
}).listen(config.port);

function handleRequest(req, res) {
    utils.log(`Request received: ${req.method}, ${req.url}`);

    switch (req.url) {
        case `/${commands.COMMAND_COMPILE}`:
            commandHandlers.compile(req, res);
            break;

        default:
            commandHandlers.unknown(req, res);
    }
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
            fs.mkdirSync(dir);
            if (!fs.existsSync(dir)) {
                throw new Error(`Could not create dir ${dir}`);
            }

            return;
        }

        if (!fs.existsSync(dir)) {
            throw new Error(`Could not find dir ${dir}`);
        }
    };
    
    if (proposedDir) {
        ensure(proposedDir, false);
        return path.normalize(proposedDir);
    }

    const homeDir = utils.getDataFolder();
    const dir = path.join(homeDir, consts.DIR_NAME);
    ensure(dir, true);
    return path.normalize(dir);
}
