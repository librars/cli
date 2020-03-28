"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compile = compile;

/**
 * compile.js
 * Andrea Tino - 2020
 * 
 * Executes a compile command.
 */
var http = require("http");

var utils = require("./utils");

var commands = require("./commands");
/**
 * Compiles a book.
 * 
 * @param {any} serverinfo The server info object.
 * @param {string} path The path to the directory containing the book to compile. 
 */


function compile(serverinfo, path) {
  http.get(commands.buildCommandUrl(serverinfo), res => {
    var data = "";
    res.on("data", chunk => {
      data += chunk;
    });
    res.on("end", () => {
      utils.log(JSON.parse(data).explanation);
    });
  }).on("error", err => {
    utils.error("An error occurred while processing command 'compile': ".concat(err));
  });
}