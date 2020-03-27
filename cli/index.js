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
const compile = require("./compile");

let command = argv.command;

if (!command) {
    throw "No command provided";
}

switch (command) {
    case commands.COMMAND_COMPILE:
        utils.log("Executing command 'compile'...");
        
        break;
}
