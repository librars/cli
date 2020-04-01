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

const common = require("@librars/cli-common");

const commands = require("./commands");

const args = fetchArgs();
const config = {
    // Server listening to this port
    port: args.port | common.DAEMON_PORT,
    // Directory where dumping received content
    dir: ensureDir(args.dir) // this will make sure the directory exists
};

common.log(`Server started. Listening on port ${config.port}...`);

// Start the server
http.createServer((req, res) => {
    handleRequest(req, res);
}).listen(config.port);

function handleRequest(req, res) {
    common.log(`Request received: ${req.method}, ${req.url}`);
    common.log(`Request headers: ${JSON.stringify(req.headers)}`);

    // Is request valid?
    const handlerMapperError = commands.mapErrorHandlingCommand(req);
    if (handlerMapperError) {
        common.error(`An error occurred while handling the request: ${handlerMapperError.error}`);

        if (handlerMapperError) {
            handlerMapperError.handler(req, res);
        }

        return;
    }

    // Compute command to use and run it
    const mappedCommandHandler = commands.mapCommand(req);
    if (!mappedCommandHandler) {
        throw new Error(`Request ${req.method}, ${req.url} could not be mapped, but the unknown handler was expected`);
    }

    mappedCommandHandler(req, res); // Run the command
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

    const homeDir = common.getDataFolder();
    const dir = path.join(homeDir, common.DIR_NAME);
    ensure(dir, true);
    return path.normalize(dir);
}
