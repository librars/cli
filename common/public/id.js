"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateId = generateId;

/**
 * id.js
 * Andrea Tino - 2020
 * 
 * Handling unique ids.
 */
var uuidv4 = require("uuid").v4;
/**
 * Generates a unique ID.
 * 
 * @param {boolean} withTimestamp A value indicating whether the id should include the timestamp.
 * @returns {string} The unique ID.
 */


function generateId(withTimestamp) {
  withTimestamp = withTimestamp || false;
  var id = uuidv4();
  return withTimestamp ? "".concat(getCurrentTimestampAsId(), "_").concat(id) : "".concat(id);
}

function getCurrentTimestampAsId() {
  var pad = x => x.length < 1 ? "0".concat(x) : "".concat(x);

  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; // Months range in 0-11

  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  var seconds = dateObj.getUTCSeconds();
  var hours = dateObj.getUTCHours();
  var minutes = dateObj.getUTCMinutes();
  return "".concat(year).concat(pad(month)).concat(pad(day), "T").concat(pad(hours)).concat(pad(minutes)).concat(pad(seconds));
}