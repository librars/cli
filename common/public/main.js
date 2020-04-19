"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filesystem = exports.communication = exports.getFilePathInDataFolder = exports.getContentFromFileInDataFolder = exports.ensureDataDir = exports.getDataFolder = exports.DIR_NAME = exports.DAEMON_PORT = exports.generateId = exports.error = exports.warn = exports.log = exports.versionsCompatibilityCheck = exports.checkVersionFormat = void 0;

/**
 * main.js
 * Andrea Tino - 2020
 * 
 * Entry point.
 */
var version = require("./version");

var logging = require("./logging");

var id = require("./id");

var config = require("./config");

var application = require("./application");

var communicationProtocol = require("./communication/protocol");

var communicationHttp = require("./communication/http");

var filesystemArchive = require("./filesystem/archive");

var filesystemIo = require("./filesystem/io");
/** @see {version.checkVersionFormat} */


var checkVersionFormat = version.checkVersionFormat;
/** @see {version.versionsCompatibilityCheck} */

exports.checkVersionFormat = checkVersionFormat;
var versionsCompatibilityCheck = version.versionsCompatibilityCheck;
/** @see {logging.log} */

exports.versionsCompatibilityCheck = versionsCompatibilityCheck;
var log = logging.log;
/** @see {logging.warn} */

exports.log = log;
var warn = logging.warn;
/** @see {logging.error} */

exports.warn = warn;
var error = logging.error;
/** @see {id.generateId} */

exports.error = error;
var generateId = id.generateId;
/** @see {config.DAEMON_PORT} */

exports.generateId = generateId;
var DAEMON_PORT = config.DAEMON_PORT;
/** @see {application.DIR_NAME} */

exports.DAEMON_PORT = DAEMON_PORT;
var DIR_NAME = application.DIR_NAME;
/** @see {application.getDataFolder} */

exports.DIR_NAME = DIR_NAME;
var getDataFolder = application.getDataFolder;
/** @see {application.ensureDataDir} */

exports.getDataFolder = getDataFolder;
var ensureDataDir = application.ensureDataDir;
/** @see {application.getContentFromFileInDataFolder} */

exports.ensureDataDir = ensureDataDir;
var getContentFromFileInDataFolder = application.getContentFromFileInDataFolder;
/** @see {application.getFilePathInDataFolder} */

exports.getContentFromFileInDataFolder = getContentFromFileInDataFolder;
var getFilePathInDataFolder = application.getFilePathInDataFolder;
/** The communication namespace. */

exports.getFilePathInDataFolder = getFilePathInDataFolder;
var communication = {
  /** @see {communicationProtocol.VERSION_HEADER_NAME} */
  VERSION_HEADER_NAME: communicationProtocol.VERSION_HEADER_NAME,

  /** @see {communicationHttp.statusCodes} */
  statusCodes: communicationHttp.statusCodes,

  /** @see {communicationHttp.addVersionHTTPHeaders} */
  addVersionHTTPHeaders: communicationHttp.addVersionHTTPHeaders,

  /** @see {communicationHttp.getVersionFromHTTPHeaders} */
  getVersionFromHTTPHeaders: communicationHttp.getVersionFromHTTPHeaders,

  /** @see {communicationHttp.addExecIdHTTPHeaders} */
  addExecIdHTTPHeaders: communicationHttp.addExecIdHTTPHeaders,

  /** @see {communicationHttp.getExecIdFromHTTPHeaders} */
  getExecIdFromHTTPHeaders: communicationHttp.getExecIdFromHTTPHeaders
};
/** The filesystem namespace. */

exports.communication = communication;
var filesystem = {
  /** @see {filesystemArchive.tarFolder} */
  tarFolder: filesystemArchive.tarFolder,

  /** @see {filesystemArchive.untarFolder} */
  untarFolder: filesystemArchive.untarFolder,

  /** @see {filesystemIo.deleteFile} */
  deleteFile: filesystemIo.deleteFile,

  /** @see {filesystemIo.deleteDirectory} */
  deleteDirectory: filesystemIo.deleteDirectory,

  /** @see {filesystemIo.moveFiles} */
  moveFiles: filesystemIo.moveFiles,

  /** @see {filesystemIo.copyFiles} */
  copyFiles: filesystemIo.copyFiles,

  /** @see {filesystemIo.ensureDirectory} */
  ensureDirectory: filesystemIo.ensureDirectory
};
exports.filesystem = filesystem;