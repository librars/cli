/**
 * config.js
 * Andrea Tino - 2020
 * 
 * Functions to operate with the daemon configuration.
 * 
 * Expected structure:
 * {
 *   rscript: <string>
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
 * Tries to find the rscript info object from the user data folder.
 * 
 * @returns {any} The rscript info object or null if not found.
 */
export function tryFetchRScriptInfoFromDataDir() {
    const configObject = get();
    if (configObject) {
        return {
            path2rscript: configObject.rscript
        };
    }

    return null;
}