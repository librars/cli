"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.tryFetchServerInfoFromDataDir = tryFetchServerInfoFromDataDir;
exports.checkServerInfo = checkServerInfo;

/**
 * config.js
 * Andrea Tino - 2020
 * 
 * Functions to operate with the client configuration.
 * 
 * Expected structure:
 * {
 *   url: <string>,
 *   port: <number>
 * }
 */
var common = require("@librars/cli-common");

var consts = require("./consts");
/**
 * Gets the configuration file content.
 * 
 * @returns {object} The parsed JSON configuration. Null if the file was not found.
 */


function get() {
  var configString = common.getContentFromFileInDataFolder(consts.CONFIG_FILE_NAME);

  if (configString) {
    return JSON.parse(configString);
  }

  return null;
}
/**
 * Tries to find the server info object from the user data folder.
 * 
 * @returns {any} The server info object or null if not found.
 */


function tryFetchServerInfoFromDataDir() {
  var configObject = get();

  if (configObject) {
    return {
      url: configObject.url,
      port: parseInt(configObject.port)
    };
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