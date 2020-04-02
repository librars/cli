"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EXTRACTED_DIR_PREFIX = exports.TAR_FILE_PREFIX = void 0;

/**
 * consts.js
 * Andrea Tino - 2020
 * 
 * Constants.
 */

/** Prefix to use when naming the archive received from a compile command. */
var TAR_FILE_PREFIX = "rcv-compile-tar";
/** Prefix to use when naming the folder hosting the archive's extracted content. */

exports.TAR_FILE_PREFIX = TAR_FILE_PREFIX;
var EXTRACTED_DIR_PREFIX = "rcv-extracted";
exports.EXTRACTED_DIR_PREFIX = EXTRACTED_DIR_PREFIX;