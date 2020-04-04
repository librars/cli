/**
 * config.js
 * Andrea Tino - 2020
 * 
 * Functions to operate with the client configuration.
 * 
 * Expected structure:
 * {
 *   url: <string>,
 *   port: <number>
 * }
 */

const common = require("@librars/cli-common");

const consts = require("./consts");

/**
 * Gets the configuration file content.
 * 
 * @returns {object} The parsed JSON configuration. Null if the file was not found.
 */
export function get() {
    const configString = common.getContentFromFileInDataFolder(consts.CONFIG_FILE_NAME);
    if (configString) {
        return JSON.parse(configString);
    }

    return null;
}

/**
 * Tries to find the server info object from the user data folder.
 * 
 * @returns {any} The server info object or null if not found.
 */
export function tryFetchServerInfoFromDataDir() {
    const configObject = get();
    if (configObject) {
        return {
            url: configObject.url,
            port: parseInt(configObject.port)
        };
    }

    return null;
}

/**
 * Checks the server info object is valid.
 * 
 * @param {any} serverinfo The server info object.
 */
export function checkServerInfo(serverinfo) {
    return serverinfo && serverinfo.url && serverinfo.port;
}
