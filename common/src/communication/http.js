/**
 * http.js
 * Andrea Tino - 2020
 * 
 * HTTP specific functionalities.
 */

const protocol = require("./protocol");

/** HTTP status codes. */
export const statusCodes = {
    /** Bad request. */
    BAD_REQUEST: 400,
};

/**
 * Ensures the version headers are added.
 * 
 * @param {any} headers The header object to which adding the headers.
 * @param {string} version The version to set.
 */
export const addVersionHTTPHeaders = (headers, version) => addToHTTPHeaders(headers, protocol.VERSION_HEADER_NAME, version);

/**
 * Extract the version header value.
 * 
 * @param {any} headers The header object to which adding the headers.
 * @returns {string} The version, null if not found.
 */
export const getVersionFromHTTPHeaders = (headers) => getHeader(headers, protocol.VERSION_HEADER_NAME);

/**
 * Ensures the execution id headers are added.
 * 
 * @param {any} headers The header object to which adding the headers.
 * @param {string} id The exid to set.
 */
export const addExecIdHTTPHeaders = (headers, exid) => addToHTTPHeaders(headers, protocol.EXEC_ID_HEADER_NAME, exid);

/**
 * Extract the execution id header value.
 * 
 * @param {any} headers The header object to which adding the headers.
 * @returns {string} The exid, null if not found.
 */
export const getExecIdFromHTTPHeaders = (headers) => getHeader(headers, protocol.EXEC_ID_HEADER_NAME);

function getHeader(headers, name) {
    if (!headers) {
        throw new Error("Parameter 'headers' cannot be null or undefined");
    }
    if (!name) {
        throw new Error("Parameter 'name' cannot be null or undefined");
    }

    if (!headers[name] || headers[name].length === 0) {
        return null;
    }

    return headers[name];
}

function addToHTTPHeaders(headers, name, value) {
    if (!value) {
        throw new Error("Parameter 'value' cannot be null or undefined");
    }

    const v = getHeader(headers, name);

    if (v) {
        throw new Error(`Header ${name} already present, its value is: '${v}'. Cannot override, forbidden`);
    }

    headers[name] = value;
}
