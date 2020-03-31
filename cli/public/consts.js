"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VERSION_HEADER_NAME = exports.PORT = exports.ZIP_INNER_FOLDER_NAME = exports.CONFIG_FILE_NAME = exports.DIR_NAME = void 0;

/**
 * consts.js
 * Andrea Tino - 2020
 * 
 * Constants.
 */

/** The name of the product directory. */
var DIR_NAME = "librars";
/** Daemon config file name. */

exports.DIR_NAME = DIR_NAME;
var CONFIG_FILE_NAME = "cli.config.json";
/** Name of the folder inside the archive that gets generated. */

exports.CONFIG_FILE_NAME = CONFIG_FILE_NAME;
var ZIP_INNER_FOLDER_NAME = "data";
/** Default port. */

exports.ZIP_INNER_FOLDER_NAME = ZIP_INNER_FOLDER_NAME;
var PORT = 8080;
/** The name of the HTTP header for version. */

exports.PORT = PORT;
var VERSION_HEADER_NAME = "librars-version";
exports.VERSION_HEADER_NAME = VERSION_HEADER_NAME;