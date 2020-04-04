"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.USR_EXTRACTION_DIR_COMPILE_PREFIX = exports.RCV_TAR_FILE_PREFIX = exports.TAR_FILE_PREFIX = exports.CONFIG_FILE_NAME = void 0;

/**
 * consts.js
 * Andrea Tino - 2020
 * 
 * Constants.
 */

/** Client config file name. */
var CONFIG_FILE_NAME = "cli.config.json";
/** Prefix to use when naming the archive generated when compiling a folder. */

exports.CONFIG_FILE_NAME = CONFIG_FILE_NAME;
var TAR_FILE_PREFIX = "compile-tar";
/** Prefix to use when naming the result archive received from server. */

exports.TAR_FILE_PREFIX = TAR_FILE_PREFIX;
var RCV_TAR_FILE_PREFIX = "rcv-result-tar";
/** Prefix to use when naming the result archive received from server. */

exports.RCV_TAR_FILE_PREFIX = RCV_TAR_FILE_PREFIX;
var USR_EXTRACTION_DIR_COMPILE_PREFIX = "librars-compile";
exports.USR_EXTRACTION_DIR_COMPILE_PREFIX = USR_EXTRACTION_DIR_COMPILE_PREFIX;