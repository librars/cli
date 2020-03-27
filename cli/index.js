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
const path = require("path");
const fs = require("fs");

const utils = require("./utils");
const commands = require("./commands");
const compile = require("./compile").compile;
const consts = require("./consts");

const args = fetchArgs();
const config = {
    // Command to execute
    command: args.command,
    // Verbosity
    verbose: args.verbose | true,
    noopts: args.noopts
};

const mach_serverinfo = fetchServerinfo();
const serverinfo = {
    url: mach_serverinfo.url,
    port: mach_serverinfo.port | consts.PORT
};

if (!serverinfo.url) {
    throw new Error("No server URL");
}

if (!config.command) {
    throw new Error("No command provided");
}

switch (command) {
    case commands.COMMAND_COMPILE:
        handleCommand(commands.COMMAND_COMPILE, handleCommandCompile);
        break;
}

function handleCommandCompile() {
    arg_path = config.noopts[1];

    compile(serverinfo, arg_path);
}

function handleCommand(name, handler) {
    utils.log(`Executing command '${name}'...`);

    try {
        handler();
    } catch (e) {
        utils.error(`An error occurred: ${e}`);
    }

    utils.log(`Command '${name}' completed.`);
}

function fetchArgs() {
    const argv = yargs.argv;

    return {
        command: argv._[0],
        verbose: argv.verbose | null,
        noopts: argv._
    };
}

function fetchServerinfo() {
    const homeDir = utils.getHomeFolder();
    const dir = path.join(homeDir, consts.DIR_NAME);

    if (fs.existsSync(dir)) {
        const configFilePath = path.join(dir, consts.CONFIG_FILE_NAME);
        if (fs.existsSync(configFilePath)) {
            const content = fs.readFileSync(configFilePath, { encoding: "utf-8" });
            if (content) {
                const json = JSON.parse(content);
                return {
                    url: json.url,
                    port: json.port
                };
            }
        }
    }

    return {
        url: null,
        port: null
    };
}
