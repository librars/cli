"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tryFetchServerInfoFromDataDir = tryFetchServerInfoFromDataDir;
exports.checkServerInfo = checkServerInfo;

/**
 * serverconfig.js
 * Andrea Tino - 2020
 * 
 * Functions to operate with the server configuration.
 * 
 * Expected structure:
 * {
 *   url: <string>,
 *   port: <number>
 * }
 */
var path = require("path");

var fs = require("fs");

var common = require("@librars/cli-common");

var consts = require("./consts");
/**
 * Tries to find the server info object from the user data folder.
 * 
 * @returns {any} The server info object or null if not found.
 */


function tryFetchServerInfoFromDataDir() {
  var dataDir = common.getDataFolder();
  var dir = path.join(dataDir, common.DIR_NAME);

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
  }

  return null;
}
/**
 * Checks the server info object is valid.
 * 
 * @param {any} serverinfo The server info object.
 */


function checkServerInfo(serverinfo) {
  return serverinfo && serverinfo.url && serverinfo.port;
}