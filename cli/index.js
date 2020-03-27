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

const argv = require("yargs").argv;

const utils = require("./utils");
const commands = require("./commands");
const compile = require("./compile").compile;

let command = argv.command;

if (!command) {
    throw "No command provided";
}

switch (command) {
    case commands.COMMAND_COMPILE:
        handleCommandCompile();
        break;
}

function handleCommandCompile() {
    utils.log("Executing command 'compile'...");

    compile("");

    utils.log("Command 'compile' completed.");
}
