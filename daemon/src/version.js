/**
 * version.js
 * Andrea Tino - 2020
 * 
 * Versioning.
 */

/** Daemon version. */
export const VERSION = "0.1.0.0";

/**
 * Throws an error if the version is not in the right format: "M.m.N.n".
 * 
 * @param {string} v The version to check.
 * @param {boolean} shouldThrow A value indicating whether to throw or not.
 * @returns {any} The version object properly parsed, null otherwise.
 */
export function checkVersionFormat(v, shouldThrow = true) {
    const error = () => {
        if (shouldThrow) {
            throw new Error(`Version ${v} has wrong format, expected 'M.m.N.n'`);
        }

        return null;
    };

    if (!v || v.length === 0) {
        return error();
    }

    const pattern = /([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)/g;
    const matches = pattern.exec(v);

    if (!matches || matches.length < 5) {
        return error();
    }

    const ncheck = (x) => parseInt(x) >= 0; // NaN would fail here
    if (!(ncheck(matches[1]) && ncheck(matches[2]) && ncheck(matches[3]) && ncheck(matches[4]))) {
        return error();
    }

    return {
        M: parseInt(matches[1]),
        m: parseInt(matches[2]),
        N: parseInt(matches[3]),
        n: parseInt(matches[4])
    };
}

/**
 * Checks version compatibility.
 * 
 * @param {atring} v1 The first version.
 * @param {string} v2 The second version.
 * @returns {number} A number lower than 0 if versions are not compatible, 0 if
 *     version are precisely compatible, a number greater than 0 if compatible.
 */
export function versionsCompatibilityCheck(v1, v2) {
    if (typeof(v1) === "string") {
        v1 = checkVersionFormat(v1, true);
    }
    if (typeof(v2) === "string") {
        v2 = checkVersionFormat(v2, true);
    }

    return v1.M - v2.M;
}
