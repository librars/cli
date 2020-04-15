"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.draft = exports.compile = void 0;

/**
 * main.js
 * Andrea Tino - 2020
 * 
 * Collecting the API to use this as a package.
 */
var compileCommand = require("./compile");

var draftCommand = require("./draft");
/** @see {compileCommand.compile} */


var compile = compileCommand.compile;
/** @see {draftCommand.draft} */

exports.compile = compile;
var draft = draftCommand.draft;
exports.draft = draft;