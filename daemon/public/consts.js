"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TRASH_CLEANUP_SCHEDULE_INTERVAL = exports.TRASH_DIR_NAME = exports.DRAFT_DIR_PREFIX = exports.EXTRACTED_DIR_PREFIX = exports.DRAFT_ARTIFACTS_TAR_FILE_PREFIX = exports.COMPILE_ARTIFACTS_TAR_FILE_PREFIX = exports.TAR_FILE_PREFIX = exports.CONFIG_FILE_NAME = void 0;

/**
 * consts.js
 * Andrea Tino - 2020
 * 
 * Constants.
 */

/** Daemon config file name. */
var CONFIG_FILE_NAME = "daemon.config.json";
/** Prefix to use when naming the archive received from client from a compile command. */

exports.CONFIG_FILE_NAME = CONFIG_FILE_NAME;
var TAR_FILE_PREFIX = "dmn-rcv-compile-tar";
/** Prefix to use when naming the archive to send back to the client containing the compilation results. */

exports.TAR_FILE_PREFIX = TAR_FILE_PREFIX;
var COMPILE_ARTIFACTS_TAR_FILE_PREFIX = "dmn-compile-result-tar";
/** Prefix to use when naming the archive to send back to the client containing the draft resources. */

exports.COMPILE_ARTIFACTS_TAR_FILE_PREFIX = COMPILE_ARTIFACTS_TAR_FILE_PREFIX;
var DRAFT_ARTIFACTS_TAR_FILE_PREFIX = "dmn-draft-result-tar";
/** Prefix to use when naming the folder hosting the archive's extracted content. */

exports.DRAFT_ARTIFACTS_TAR_FILE_PREFIX = DRAFT_ARTIFACTS_TAR_FILE_PREFIX;
var EXTRACTED_DIR_PREFIX = "dmn-rcv-extracted";
/** Prefix to use when naming the folder hosting a draft's files. */

exports.EXTRACTED_DIR_PREFIX = EXTRACTED_DIR_PREFIX;
var DRAFT_DIR_PREFIX = "dmn-draft-content";
/** Name to assign to the trash folder. */

exports.DRAFT_DIR_PREFIX = DRAFT_DIR_PREFIX;
var TRASH_DIR_NAME = ".dmn-trash";
/** Number of milliseconds after which scheduling a trash cleanup. */

exports.TRASH_DIR_NAME = TRASH_DIR_NAME;
var TRASH_CLEANUP_SCHEDULE_INTERVAL = 10 * 60 * 1000;
exports.TRASH_CLEANUP_SCHEDULE_INTERVAL = TRASH_CLEANUP_SCHEDULE_INTERVAL;