/**
 * consts.js
 * Andrea Tino - 2020
 * 
 * Constants.
 */

/** Client config file name. */
export const CONFIG_FILE_NAME = "cli.config.json";

/** Prefix to use when naming the archive generated when compiling a folder. */
export const TAR_FILE_PREFIX = "cli-compile-tar";

/** Prefix to use when naming the result archive received from server. */
export const RCV_TAR_FILE_PREFIX = "cli-rcv-result-tar";

/** 
 * Prefix to use when naming the directory created to place the extracted
 * content from the archive received from server when compiling. 
 */
export const USR_EXTRACTION_DIR_COMPILE_PREFIX = "librars-compile";

/** Name to assign to the trash folder. */
export const TRASH_DIR_NAME = ".cli-trash";

/** Number of max elements in the trash which should trigger a cleanup in the next round. */
export const TRASH_CLEANUP_SCHEDULE_THRESHOLD = 10 * 60 * 1000;
