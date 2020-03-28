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

var path = require("path");

var fs = require("fs");

var utils = require("./utils");

var commands = require("./commands");

var compile = require("./compile").compile;

var consts = require("./consts");

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
  compile(serverinfo, argPath);
}

function handleCommand(name, handler) {
  utils.log("Executing command '".concat(name, "'..."));

  try {
    handler();
  } catch (e) {
    utils.error("An error occurred: ".concat(e));
    throw e; // Re-throw to make sure stack is displayed
  }

  utils.log("Command '".concat(name, "' completed."));
}

function fetchArgs() {
  var argv = yargs.argv;
  return {
    command: argv._[0],
    verbose: argv.verbose | null,
    serverurl: argv.serverurl | null,
    serverport: argv.serverport | null,
    noopts: argv._ | []
  };
}

function fetchServerinfo(config) {
  var homeDir = utils.getDataFolder();
  var dir = path.join(homeDir, consts.DIR_NAME); // Start looking in the user data dir

  if (fs.existsSync(dir)) {
    var configFilePath = path.join(dir, consts.CONFIG_FILE_NAME);

    if (fs.existsSync(configFilePath)) {
      var content = fs.readFileSync(configFilePath, {
        encoding: "utf-8"
      });

      if (content) {
        var json = JSON.parse(content);
        return {
          url: json.url,
          port: parseInt(json.port)
        };
      }
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