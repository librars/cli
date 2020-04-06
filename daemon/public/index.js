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

var common = require("@librars/cli-common");

var commands = require("./commands");

var consts = require("./consts");

var args = fetchArgs();
var config = {
  // Server listening to this port
  port: args.port | common.DAEMON_PORT,
  // Directory where dumping received content
  dir: ensureDir(args.dir) // this will make sure the directory exists

}; // Extra config

var runTrashCleanupScheduler = false;
common.log("Server started. Listening on port ".concat(config.port, "...")); // Start the server

http.createServer((req, res) => {
  handleRequest(req, res);
}).listen(config.port); // Start trash cleanup scheduler

if (runTrashCleanupScheduler) {
  startTrashCleaupScheduler();
}

function startTrashCleaupScheduler() {
  common.log("Trash cleanup scheduler started, interval (ms): ".concat(consts.TRASH_CLEANUP_SCHEDULE_INTERVAL));

  var cleanUpTrash = () => {// TODO
  };

  setInterval(() => {
    common.log("About to cleanup trash...");
    cleanUpTrash();
    common.log("Trash cleaned up! See you in ".concat(consts.TRASH_CLEANUP_SCHEDULE_INTERVAL, " ms..."));
  }, consts.TRASH_CLEANUP_SCHEDULE_INTERVAL);
}

function handleRequest(req, res) {
  common.log("Request received: ".concat(req.method, ", ").concat(req.url));
  common.log("Request headers: ".concat(JSON.stringify(req.headers))); // Is request valid?

  var handlerMapperError = commands.mapErrorHandlingCommand(req);

  if (handlerMapperError) {
    common.error("An error occurred while handling the request: ".concat(handlerMapperError.error));

    if (handlerMapperError) {
      handlerMapperError.handler(req, res);
    }

    return;
  } // Compute command to use and run it


  var mappedCommandHandler = commands.mapCommand(req);

  if (!mappedCommandHandler) {
    throw new Error("Request ".concat(req.method, ", ").concat(req.url, " could not be mapped, but the unknown handler was expected"));
  }

  mappedCommandHandler(req, res); // Run the command
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

  var homeDir = common.getDataFolder();
  var dir = path.join(homeDir, common.DIR_NAME);
  ensure(dir, true);
  return path.normalize(dir);
}