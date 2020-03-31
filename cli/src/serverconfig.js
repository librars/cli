/**
 * serverconfig.js
 * Andrea Tino - 2020
 * 
 * Functions to operate with the server configuration.
 * 
 * Expected structure:
 * {
 *   url: <string>,
 *   port: <number>
 * }
 */

const path = require("path");
const fs = require("fs");

const common = require("@librars/cli-common");

const consts = require("./consts");

/**
 * Tries to find the server info object from the user data folder.
 * 
 * @returns {any} The server info object or null if not found.
 */
export function tryFetchServerInfoFromDataDir() {
    const dataDir = common.getDataFolder();
    const dir = path.join(dataDir, common.DIR_NAME);

    if (fs.existsSync(dir)) {
        const configFilePath = path.join(dir, consts.CONFIG_FILE_NAME);

        if (fs.existsSync(configFilePath)) {
            const content = fs.readFileSync(configFilePath, { encoding: "utf-8" });

            if (content) {
                const json = JSON.parse(content);

                return {
                    url: json.url,
                    port: parseInt(json.port)
                };
            }
        }
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
