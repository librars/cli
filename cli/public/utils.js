"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moveToTrash = moveToTrash;
exports.ensureProperFsNodeName = ensureProperFsNodeName;

/**
 * utils.js
 * Andrea Tino - 2020
 * 
 * Utilities.
 */
var fs = require("fs");
/**
 * Moves a resource (file or directory) to the trash folder.
 * 
 * @param {string} resourcePath The path to the resource to move to trash.
 * @returns {stirng} The path to the trash folder whee the resource has been moved. Null if no move was performed.
 */


function moveToTrash(resourcePath) {
  if (!fs.existsSync(resourcePath)) {
    return null;
  } // TODO

}
/**
 * Ensures a proper name for a filesystem entity.
 * 
 * @param {string} name The candidate name.
 * @returns {string} The adjusted name (no spaces and special chars).
 */


function ensureProperFsNodeName(name) {
  return name.replace(/\s+/g, "");
}