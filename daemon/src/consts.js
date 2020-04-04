/**
 * consts.js
 * Andrea Tino - 2020
 * 
 * Constants.
 */

/** Daemon config file name. */
export const CONFIG_FILE_NAME = "daemon.config.json";

/** Prefix to use when naming the archive received from a compile command. */
export const TAR_FILE_PREFIX = "rcv-compile-tar";

/** Prefix to use when naming the archive to send back to the client containing the compilation results. */
export const COMPILE_ARTIFACTS_TAR_FILE_PREFIX = "result-tar";

/** Prefix to use when naming the folder hosting the archive's extracted content. */
export const EXTRACTED_DIR_PREFIX = "rcv-extracted";
