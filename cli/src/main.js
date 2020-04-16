/**
 * main.js
 * Andrea Tino - 2020
 * 
 * Collecting the API to use this as a package.
 */

const pingCommand = require("./ping"); 
const compileCommand = require("./compile");
const draftCommand = require("./draft");
const listCommand = require("./list"); 

/** @see {pingCommand.ping} */
export const ping = pingCommand.ping;

/** @see {compileCommand.compile} */
export const compile = compileCommand.compile;

/** @see {draftCommand.draft} */
export const draft = draftCommand.draft;

/** @see {listCommand.list} */
export const list = listCommand.list;
