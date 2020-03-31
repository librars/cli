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

var version = require("./version");

var commandHandlers = {
  compile: require("./handlers/compile").handleCompile,
  unknown: require("./handlers/unknown").handleUnknown,
  notcompatible: require("./handlers/notcompatible").handleNotCompatible
};
var args = fetchArgs();
var config = {
  // Server listening to this port
  port: args.port | 8080,
  // Directory where dumping received content
  dir: ensureDir(args.dir) // this will make sure the directory exists

};
common.log("Server started. Listening on port ".concat(config.port, "...")); // Start the server

http.createServer((req, res) => {
  handleRequest(req, res);
}).listen(config.port);

function handleRequest(req, res) {
  common.log("Request received: ".concat(req.method, ", ").concat(req.url));
  common.log("Request headers: ".concat(JSON.stringify(req.headers)));

  if (!checkApiVersion(req)) {
    common.error("API version check failed for request. Request: ".concat(getVersionHeaderValue(req), ", daemon: ").concat(version.VERSION));
    commandHandlers.notcompatible(req, res);
    return;
  }

  switch (req.url) {
    case "/".concat(commands.COMMAND_COMPILE):
      commandHandlers.compile(req, res);
      break;

    default:
      commandHandlers.unknown(req, res);
  }
}

function getVersionHeaderValue(req) {
  return common.communication.getVersionFromHTTPHeaders(req.headers);
}

function checkApiVersion(req) {
  var v = getVersionHeaderValue(req);
  var parsedVersion = common.checkVersionFormat(v, false);

  if (!parsedVersion) {
    return false;
  }

  return common.versionsCompatibilityCheck(parsedVersion, version.VERSION) >= 0;
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