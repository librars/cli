/**
 * commands.js
 * Andrea Tino - 2020
 * 
 * List of available commands.
 */

/**
 * Compile.
 */
export const COMMAND_COMPILE = "compile";
/**
 * Creates the proper URL to call a command.
 * 
 * @param {*} serverinfo The server info object.
 * @param {*} command The command to build.
 */

export function buildCommandUrl(serverinfo, command) {
  return `${serverinfo.url}:${serverinfo.port}/${command}`;
}