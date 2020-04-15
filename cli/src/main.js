/**
 * main.js
 * Andrea Tino - 2020
 * 
 * Collecting the API to use this as a package.
 */

const compileCommand = require("./compile"); 
const draftCommand = require("./draft"); 

/** @see {compileCommand.compile} */
export const compile = compileCommand.compile;

/** @see {draftCommand.draft} */
export const draft = draftCommand.draft;
