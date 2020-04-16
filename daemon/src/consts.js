/**
 * consts.js
 * Andrea Tino - 2020
 * 
 * Constants.
 */

/** Daemon config file name. */
export const CONFIG_FILE_NAME = "daemon.config.json";

/** Prefix to use when naming the archive received from client from a compile command. */
export const TAR_FILE_PREFIX = "dmn-rcv-compile-tar";

/** Prefix to use when naming the archive to send back to the client containing the compilation results. */
export const COMPILE_ARTIFACTS_TAR_FILE_PREFIX = "dmn-compile-result-tar";

/** Prefix to use when naming the archive to send back to the client containing the draft resources. */
export const DRAFT_ARTIFACTS_TAR_FILE_PREFIX = "dmn-draft-result-tar";

/** Prefix to use when naming the folder hosting the archive's extracted content. */
export const EXTRACTED_DIR_PREFIX = "dmn-rcv-extracted";

/** Prefix to use when naming the folder hosting a draft's files. */
export const DRAFT_DIR_PREFIX = "dmn-draft-content";

/** Name to assign to the trash folder. */
export const TRASH_DIR_NAME = ".dmn-trash";

/** Number of milliseconds after which scheduling a trash cleanup. */
export const TRASH_CLEANUP_SCHEDULE_INTERVAL = 10 * 60 * 1000;
