"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = exports.draft = exports.compile = exports.ping = void 0;

/**
 * main.js
 * Andrea Tino - 2020
 * 
 * Collecting the API to use this as a package.
 */
var pingCommand = require("./ping");

var compileCommand = require("./compile");

var draftCommand = require("./draft");

var listCommand = require("./list");
/** @see {pingCommand.ping} */


var ping = pingCommand.ping;
/** @see {compileCommand.compile} */

exports.ping = ping;
var compile = compileCommand.compile;
/** @see {draftCommand.draft} */

exports.compile = compile;
var draft = draftCommand.draft;
/** @see {listCommand.list} */

exports.draft = draft;
var list = listCommand.list;
exports.list = list;