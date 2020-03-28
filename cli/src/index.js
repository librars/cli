/**
 * index.js
 * Andrea Tino - 2020
 * 
 * Entry file.
 * 
 * Usage:
 * node index.js <command>
 * 
 * Available commands:
 * - compile
 */

const yargs = require("yargs");

const utils = require("./utils");
const commands = require("./commands");
const compile = require("./compile").compile;
const consts = require("./consts");
const serverconfig = require("./serverconfig");

const args = fetchArgs();
const config = {
    // Command to execute
    command: args.command,
    // Verbosity
    verbose: args.verbose | true,
    // Server info
    serverurl: args.serverurl,
    serverport: args.serverport,
    // Other args specific to commands
    noopts: args.noopts
};

const machServerinfo = fetchServerinfo(config);
const serverinfo = {
    url: machServerinfo.url,
    port: machServerinfo.port | consts.PORT
};

if (!serverinfo.url) {
    throw new Error("The server URL could not be retrieved");
}

if (!config.command) {
    throw new Error("No command provided");
}

switch (config.command) {
    case commands.COMMAND_COMPILE:
        handleCommand(commands.COMMAND_COMPILE, handleCommandCompile);
        break;
}

function handleCommandCompile() {
    const argPath = config.noopts[1];

    compile(serverinfo, argPath).then(() => {
        utils.log(`Completed command ${commands.COMMAND_COMPILE}`);
    }).catch((e) => {
        utils.error(`Command ${commands.COMMAND_COMPILE} encountered an error: ${e}`);
    });
}

function handleCommand(name, handler) {
    utils.log(`Executing command '${name}'...`);

    try {
        handler(); // Handling fujnction is async
    } catch (e) {
        utils.error(`An error occurred: ${e}`);
        throw e; // Re-throw to make sure stack is displayed
    }
}

function fetchArgs() {
    const argv = yargs.argv;

    return {
        command: argv._[0],
        verbose: argv.verbose || null,
        serverurl: argv.serverurl || null,
        serverport: argv.serverport || null,
        noopts: argv._ || []
    };
}

function fetchServerinfo(config) {
    // Start looking in the user data dir
    const serverinfoFromDataDir = serverconfig.tryFetchServerInfoFromDataDir();
    if (serverinfoFromDataDir) {
        if (serverconfig.checkServerInfo(serverinfoFromDataDir)) {
            return serverinfoFromDataDir;
        }
    }

    // If fail, attempt getting the info from args
    if(config.serverurl && config.serverport) {
        return {
            url: config.serverurl,
            port: parseInt(config.serverport)
        };
    }

    // Fail
    return {
        url: null,
        port: null
    };
}