"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EXTRACTED_DIR_PREFIX = exports.COMPILE_ARTIFACTS_TAR_FILE_PREFIX = exports.TAR_FILE_PREFIX = exports.CONFIG_FILE_NAME = void 0;

/**
 * consts.js
 * Andrea Tino - 2020
 * 
 * Constants.
 */

/** Daemon config file name. */
var CONFIG_FILE_NAME = "daemon.config.json";
/** Prefix to use when naming the archive received from a compile command. */

exports.CONFIG_FILE_NAME = CONFIG_FILE_NAME;
var TAR_FILE_PREFIX = "rcv-compile-tar";
/** Prefix to use when naming the archive to send back to the client containing the compilation results. */

exports.TAR_FILE_PREFIX = TAR_FILE_PREFIX;
var COMPILE_ARTIFACTS_TAR_FILE_PREFIX = "result-tar";
/** Prefix to use when naming the folder hosting the archive's extracted content. */

exports.COMPILE_ARTIFACTS_TAR_FILE_PREFIX = COMPILE_ARTIFACTS_TAR_FILE_PREFIX;
var EXTRACTED_DIR_PREFIX = "rcv-extracted";
exports.EXTRACTED_DIR_PREFIX = EXTRACTED_DIR_PREFIX;