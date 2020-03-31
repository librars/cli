"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addVersionHTTPHeaders = addVersionHTTPHeaders;
exports.getVersionFromHTTPHeaders = getVersionFromHTTPHeaders;

/**
 * http.js
 * Andrea Tino - 2020
 * 
 * HTTP specific functionalities.
 */
var protocol = require("./protocol");
/**
 * Ensures the version headers are added.
 * 
 * @param {any} headers The header object to which adding the version headers.
 * @param {string} version The version to set.
 */


function addVersionHTTPHeaders(headers, version) {
  var v = getVersionFromHTTPHeaders(headers);

  if (v) {
    throw new Error("Header ".concat(protocol.VERSION_HEADER_NAME, " already present: ").concat(v));
  }

  headers[protocol.VERSION_HEADER_NAME] = version;
}
/**
 * Extract the version header value.
 * 
 * @param {any} headers The header object to which adding the version headers.
 * @returns {string} The version, null if not found.
 */


function getVersionFromHTTPHeaders(headers) {
  if (!headers) {
    throw new Error("Parameter 'headers' cannot be null or undefined");
  }

  if (!headers[protocol.VERSION_HEADER_NAME] || headers[protocol.VERSION_HEADER_NAME].length === 0) {
    return null;
  }

  return headers[protocol.VERSION_HEADER_NAME];
}