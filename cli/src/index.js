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
 * - draft
 */

const yargs = require("yargs");

const common = require("@librars/cli-common");

const commands = require("./commands");
const ping = require("./ping").ping;
const compile = require("./compile").compile;
const draft = require("./draft").draft;
const list = require("./list").list;
const serverconfig = require("./config");

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

// Extra config
const runTrashCleanupScheduler = false;

const machServerinfo = fetchServerinfo(config);
const serverinfo = {
    url: machServerinfo.url,
    port: machServerinfo.port | common.DAEMON_PORT
};

if (!serverinfo.url) {
    throw new Error("The server URL could not be retrieved");
}

if (!config.command) {
    throw new Error("No command provided");
}

const exid = commands.newCommandExecId();
common.log(`Command EXID: ${exid}`);

switch (config.command) {
    case commands.COMMAND_PING:
        handleCommand(commands.COMMAND_PING, handleCommandPing);
        break;

    case commands.COMMAND_COMPILE:
        handleCommand(commands.COMMAND_COMPILE, handleCommandCompile);
        break;

    case commands.COMMAND_DRAFT:
        handleCommand(commands.COMMAND_DRAFT, handleCommandDraft);
        break;

    case commands.COMMAND_LIST:
        handleCommand(commands.COMMAND_LIST, handleCommandList);
        break;
}

if (runTrashCleanupScheduler) {
    tryCleanUpTrash();
}

function tryCleanUpTrash() {
    // TODO
}

function handleCommandPing() {
    // This command accepts no arguments

    ping(exid, serverinfo).then(() => {
        common.log(`Completed command ${commands.COMMAND_PING}`);
    }).catch((e) => {
        common.error(`Command ${commands.COMMAND_PING} encountered an error: '${e}'`);
    });
}

function handleCommandCompile() {
    const argPath = config.noopts[1]; // Path to where source files are

    compile(exid, serverinfo, argPath, true).then(() => {
        common.log(`Completed command ${commands.COMMAND_COMPILE}`);
    }).catch((e) => {
        common.error(`Command ${commands.COMMAND_COMPILE} encountered an error: '${e}'`);
    });
}

function handleCommandDraft() {
    const argTemplateName = config.noopts[1]; // Template name
    const argPath = config.noopts[2]; // Path to where creating the draft

    draft(exid, serverinfo, argTemplateName, argPath, true).then(() => {
        common.log(`Completed command ${commands.COMMAND_DRAFT}`);
    }).catch((e) => {
        common.error(`Command ${commands.COMMAND_DRAFT} encountered an error: '${e}'`);
    });
}

function handleCommandList() {
    // This command accepts no arguments

    list(exid, serverinfo).then(() => {
        common.log(`Completed command ${commands.COMMAND_LIST}`);
    }).catch((e) => {
        common.error(`Command ${commands.COMMAND_LIST} encountered an error: '${e}'`);
    });
}

function handleCommand(name, handler) {
    common.log(`Executing command '${name}'...`);

    try {
        handler(); // Handling fujnction is async
    } catch (e) {
        common.error(`An error occurred: ${e}`);
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
