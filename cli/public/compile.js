/**
 * compile.js
 * Andrea Tino - 2020
 * 
 * Executes a compile command.
 */
const http = require("http");

const utils = require("./utils");

const commands = require("./commands");
/**
 * Compiles a book.
 * 
 * @param {any} serverinfo The server info object.
 * @param {string} path The path to the directory containing the book to compile. 
 */


export function compile(serverinfo, path) {
  http.get(commands.buildCommandUrl(serverinfo), res => {
    let data = "";
    res.on("data", chunk => {
      data += chunk;
    });
    res.on("end", () => {
      utils.log(JSON.parse(data).explanation);
    });
  });
}