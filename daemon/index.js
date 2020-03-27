/**
 * index.js
 * Andrea Tino - 2020
 * 
 * Entry file.
 */


const http = require("http");

http.createServer(function(req, res) {
    res.write("Hello there");
    res.end();
}).listen(8080);