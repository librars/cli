/**
 * main.js
 * Andrea Tino - 2020
 * 
 * Entry point.
 */

const version = require("./version");
const logging = require("./logging");
const id = require("./id");
const application = require("./application");
const communicationProtocol = require("./communication/protocol");
const communicationHttp = require("./communication/http");
const filesystemArchive = require("./filesystem/archive");




/** @see {version.checkVersionFormat} */
export const checkVersionFormat = version.checkVersionFormat;

/** @see {version.versionsCompatibilityCheck} */
export const versionsCompatibilityCheck = version.versionsCompatibilityCheck;




/** @see {logging.log} */
export const log = logging.log;

/** @see {logging.warn} */
export const warn = logging.warn;

/** @see {logging.error} */
export const error = logging.error;




/** @see {id.generateId} */
export const generateId = id.generateId;




/** @see {application.DIR_NAME} */
export const DIR_NAME = application.DIR_NAME;

/** @see {application.getDataFolder} */
export const getDataFolder = application.getDataFolder;

/** @see {application.ensureDataDir} */
export const ensureDataDir = application.ensureDataDir;




/** The communication namespace. */
export const communication = {
    /** @see {communicationProtocol.VERSION_HEADER_NAME} */
    VERSION_HEADER_NAME: communicationProtocol.VERSION_HEADER_NAME,

    /** @see {communicationHttp.addVersionHTTPHeaders} */
    addVersionHTTPHeaders: communicationHttp.addVersionHTTPHeaders,
    /** @see {communicationHttp.statusCodes} */
    statusCodes: communicationHttp.statusCodes,
    /** @see {communicationHttp.getVersionFromHTTPHeaders} */
    getVersionFromHTTPHeaders: communicationHttp.getVersionFromHTTPHeaders,
};




/** The filesystem namespace. */
export const filesystem = {
    /** @see {filesystemArchive.tarFolder} */
    tarFolder: filesystemArchive.tarFolder,
    /** @see {filesystemArchive.untarFolder} */
    untarFolder: filesystemArchive.untarFolder,
};
