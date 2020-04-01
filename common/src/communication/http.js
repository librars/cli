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
 * @param {any} headers The header object to which adding the version headers.
 * @param {string} version The version to set.
 */
export function addVersionHTTPHeaders(headers, version) {
    const v = getVersionFromHTTPHeaders(headers);

    if (v) {
        throw new Error(`Header ${protocol.VERSION_HEADER_NAME} already present: ${v}`);
    }

    headers[protocol.VERSION_HEADER_NAME] = version;
}

/**
 * Extract the version header value.
 * 
 * @param {any} headers The header object to which adding the version headers.
 * @returns {string} The version, null if not found.
 */
export function getVersionFromHTTPHeaders(headers) {
    if (!headers) {
        throw new Error("Parameter 'headers' cannot be null or undefined");
    }

    if (!headers[protocol.VERSION_HEADER_NAME] || headers[protocol.VERSION_HEADER_NAME].length === 0) {
        return null;
    }

    return headers[protocol.VERSION_HEADER_NAME];
}
