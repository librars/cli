"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseJsonString = parseJsonString;

/**
 * utils.js
 * Andrea Tino - 2020
 * 
 * Utilities.
 */

/**
 * Tries to parse a JSON string into an object without throwing.
 * 
 * @param {string} str The string to parse.
 * @returns {object} The parsed object or null.
 */
function parseJsonString(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}