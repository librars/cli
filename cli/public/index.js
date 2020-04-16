"use strict";

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
var yargs = require("yargs");

var common = require("@librars/cli-common");

var commands = require("./commands");

var compile = require("./compile").compile;

var draft = require("./draft").draft;

var list = require("./list").list;

var serverconfig = require("./config");

var args = fetchArgs();
var config = {
  // Command to execute
  command: args.command,
  // Verbosity
  verbose: args.verbose | true,
  // Server info
  serverurl: args.serverurl,
  serverport: args.serverport,
  // Other args specific to commands
  noopts: args.noopts
}; // Extra config

var runTrashCleanupScheduler = false;
var machServerinfo = fetchServerinfo(config);
var serverinfo = {
  url: machServerinfo.url,
  port: machServerinfo.port | common.DAEMON_PORT
};

if (!serverinfo.url) {
  throw new Error("The server URL could not be retrieved");
}

if (!config.command) {
  throw new Error("No command provided");
}

var exid = commands.newCommandExecId();
common.log("Command EXID: ".concat(exid));

switch (config.command) {
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

function tryCleanUpTrash() {// TODO
}

function handleCommandCompile() {
  var argPath = config.noopts[1]; // Path to where source files are

  compile(exid, serverinfo, argPath, true).then(() => {
    common.log("Completed command ".concat(commands.COMMAND_COMPILE));
  }).catch(e => {
    common.error("Command ".concat(commands.COMMAND_COMPILE, " encountered an error: '").concat(e, "'"));
  });
}

function handleCommandDraft() {
  var argTemplateName = config.noopts[1]; // Template name

  var argPath = config.noopts[2]; // Path to where creating the draft

  draft(exid, serverinfo, argTemplateName, argPath, true).then(() => {
    common.log("Completed command ".concat(commands.COMMAND_DRAFT));
  }).catch(e => {
    common.error("Command ".concat(commands.COMMAND_DRAFT, " encountered an error: '").concat(e, "'"));
  });
}

function handleCommandList() {
  // This command accepts no arguments
  list(exid, serverinfo).then(() => {
    common.log("Completed command ".concat(commands.COMMAND_LIST));
  }).catch(e => {
    common.error("Command ".concat(commands.COMMAND_LIST, " encountered an error: '").concat(e, "'"));
  });
}

function handleCommand(name, handler) {
  common.log("Executing command '".concat(name, "'..."));

  try {
    handler(); // Handling fujnction is async
  } catch (e) {
    common.error("An error occurred: ".concat(e));
    throw e; // Re-throw to make sure stack is displayed
  }
}

function fetchArgs() {
  var argv = yargs.argv;
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
  var serverinfoFromDataDir = serverconfig.tryFetchServerInfoFromDataDir();

  if (serverinfoFromDataDir) {
    if (serverconfig.checkServerInfo(serverinfoFromDataDir)) {
      return serverinfoFromDataDir;
    }
  } // If fail, attempt getting the info from args


  if (config.serverurl && config.serverport) {
    return {
      url: config.serverurl,
      port: parseInt(config.serverport)
    };
  } // Fail


  return {
    url: null,
    port: null
  };
}