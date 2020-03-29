"use strict";

/**
 * index.js
 * Andrea Tino - 2020
 * 
 * Entry file.
 * 
 * How to invoke:
 * node index.js --port <port> --dir <dir>
 */
var http = require("http");

var path = require("path");

var fs = require("fs");

var yargs = require("yargs");

var utils = require("./utils");

var consts = require("./consts");

var commands = require("./commands");

var commandHandlers = {
  compile: require("./handlers/compile").handleCompile,
  unknown: require("./handlers/unknown").handleUnknown
};
var args = fetchArgs();
var config = {
  // Server listening to this port
  port: args.port | 8080,
  // Directory where dumping received content
  dir: ensureDir(args.dir) // this will make sure the directory exists

};
utils.log("Server started. Listening on port ".concat(config.port, "...")); // Start the server

http.createServer((req, res) => {
  handleRequest(req, res);
}).listen(config.port);

function handleRequest(req, res) {
  utils.log("Request received: ".concat(req.method, ", ").concat(req.url));

  switch (req.url) {
    case "/".concat(commands.COMMAND_COMPILE):
      commandHandlers.compile(req, res);
      break;

    default:
      commandHandlers.unknown(req, res);
  }
}

function fetchArgs() {
  var argv = yargs.argv;
  return {
    port: argv.port | null,
    dir: argv.dir | null
  };
}

function ensureDir(proposedDir) {
  var ensure = (dir, shouldCreate) => {
    if (!fs.existsSync(dir) && shouldCreate) {
      fs.mkdirSync(dir);

      if (!fs.existsSync(dir)) {
        throw new Error("Could not create dir ".concat(dir));
      }

      return;
    }

    if (!fs.existsSync(dir)) {
      throw new Error("Could not find dir ".concat(dir));
    }
  };

  if (proposedDir) {
    ensure(proposedDir, false);
    return path.normalize(proposedDir);
  }

  var homeDir = utils.getDataFolder();
  var dir = path.join(homeDir, consts.DIR_NAME);
  ensure(dir, true);
  return path.normalize(dir);
}