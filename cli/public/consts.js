"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TRASH_CLEANUP_SCHEDULE_THRESHOLD = exports.TRASH_DIR_NAME = exports.USR_EXTRACTION_DIR_DRAFT_PREFIX = exports.USR_EXTRACTION_DIR_COMPILE_PREFIX = exports.RCV_TAR_FILE_PREFIX = exports.TAR_FILE_PREFIX = exports.CONFIG_FILE_NAME = void 0;

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
var TAR_FILE_PREFIX = "cli-compile-tar";
/** Prefix to use when naming the result archive received from server. */

exports.TAR_FILE_PREFIX = TAR_FILE_PREFIX;
var RCV_TAR_FILE_PREFIX = "cli-rcv-result-tar";
/** 
 * Prefix to use when naming the directory created to place the extracted
 * content from the archive received from server when compiling. 
 */

exports.RCV_TAR_FILE_PREFIX = RCV_TAR_FILE_PREFIX;
var USR_EXTRACTION_DIR_COMPILE_PREFIX = "librars-compile";
/** 
 * Prefix to use when naming the directory created to place the extracted
 * content from the archive received from server when requesting a template draft. 
 */

exports.USR_EXTRACTION_DIR_COMPILE_PREFIX = USR_EXTRACTION_DIR_COMPILE_PREFIX;
var USR_EXTRACTION_DIR_DRAFT_PREFIX = "librars-draft";
/** Name to assign to the trash folder. */

exports.USR_EXTRACTION_DIR_DRAFT_PREFIX = USR_EXTRACTION_DIR_DRAFT_PREFIX;
var TRASH_DIR_NAME = ".cli-trash";
/** Number of max elements in the trash which should trigger a cleanup in the next round. */

exports.TRASH_DIR_NAME = TRASH_DIR_NAME;
var TRASH_CLEANUP_SCHEDULE_THRESHOLD = 10 * 60 * 1000;
exports.TRASH_CLEANUP_SCHEDULE_THRESHOLD = TRASH_CLEANUP_SCHEDULE_THRESHOLD;