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
 */
var yargs = require("yargs");

var utils = require("./utils");

var commands = require("./commands");

var compile = require("./compile").compile;

var consts = require("./consts");

var serverconfig = require("./serverconfig");

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
};
var machServerinfo = fetchServerinfo(config);
var serverinfo = {
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
  var argPath = config.noopts[1];
  compile(serverinfo, argPath).then(() => {
    utils.log("Completed command ".concat(commands.COMMAND_COMPILE));
  }).catch(e => {
    utils.error("Command ".concat(commands.COMMAND_COMPILE, " encountered an error: ").concat(e));
  });
}

function handleCommand(name, handler) {
  utils.log("Executing command '".concat(name, "'..."));

  try {
    handler(); // Handling fujnction is async
  } catch (e) {
    utils.error("An error occurred: ".concat(e));
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