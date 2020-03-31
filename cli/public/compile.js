"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compile = compile;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * compile.js
 * Andrea Tino - 2020
 * 
 * Executes a compile command.
 */
var fs = require("fs");

var path = require("path");

var http = require("http");

var utils = require("./utils");

var commands = require("./commands");

var operations = require("./operations");
/**
 * Compiles a book.
 * 
 * @param {any} serverinfo The server info object.
 * @param {string} dirpath The path to the directory containing the book to compile.
 * @param {boolean} cleanAfter A value indicating whether to clean intermediate resources after the transmission completes.
 * @returns {Promise} a promise.
 * @async
 */


function compile(_x, _x2) {
  return _compile.apply(this, arguments);
}

function _compile() {
  _compile = _asyncToGenerator(function* (serverinfo, dirpath) {
    var cleanAfter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    if (!serverinfo) {
      throw new Error("Argument serverinfo canot be null or undefined");
    }

    if (!dirpath) {
      throw new Error("Argument dirpath canot be null or undefined");
    }

    if (!fs.existsSync(dirpath)) {
      throw new Error("dirpath ".concat(dirpath, " could not be found"));
    }

    if (!fs.statSync(dirpath).isDirectory) {
      throw new Error("Path ".concat(dirpath, " does not point to a directory"));
    } // Generate the tar


    var tarPath = yield createTar(dirpath);
    utils.log("Tar created: ".concat(tarPath)); // Base64 encode

    var buffer = fs.readFileSync(tarPath);
    var base64data = buffer.toString("base64");
    utils.log("Tar base64 computed (len: ".concat(base64data.length, "): ").concat(base64data)); // Transmit the zip

    return new Promise((resolve, reject) => {
      var options = {
        hostname: serverinfo.url,
        port: serverinfo.port,
        path: "/".concat(commands.COMMAND_COMPILE),
        method: "POST",
        protocol: "http:",
        encoding: null,
        headers: {
          "Content-Type": "text/plain"
        }
      };
      var commandUrl = commands.buildCommandUrl(serverinfo, commands.COMMAND_COMPILE);
      utils.log("Initiating transmission to: ".concat(commandUrl));
      var clientRequest = http.request(options, res => {
        utils.log("STATUS: ".concat(res.statusCode));
        utils.log("HEADERS: ".concat(JSON.stringify(res.headers))); // res.setEncoding('utf8');

        var data = "";
        res.on("data", chunk => {
          data += chunk;
        });
        res.on("end", () => {
          utils.log(data); // Cleanup on finalize

          if (cleanAfter) {
            clean(tarPath);
          }

          resolve(); // Resolve only when receiving the response
        });
      });
      clientRequest.on("error", err => {
        // Cleanup upon error
        if (cleanAfter) {
          clean(tarPath);
        }

        reject(err);
      }); // Send request

      clientRequest.write(base64data, "utf-8", err => {
        if (err) {
          utils.error("Error while sending request: ".concat(err));
          return;
        }

        clientRequest.end(() => {
          utils.log("Request tx completed. Data transmitted to ".concat(commandUrl));
          utils.log("Awaiting response...");
        });
      });
    });
  });
  return _compile.apply(this, arguments);
}

function createTar(_x3) {
  return _createTar.apply(this, arguments);
} // eslint-disable-next-line no-unused-vars


function _createTar() {
  _createTar = _asyncToGenerator(function* (dirpath) {
    var dstDir = utils.ensureDataDir();
    var tarFileName = "tar-".concat(utils.generateId(true));
    var tarPath = yield operations.tarFolder(dirpath, dstDir, tarFileName);

    if (path.join(dstDir, "".concat(tarFileName, ".tgz")) !== tarPath) {
      throw new Error("Created tar ".concat(tarPath, " was supposed to be in ").concat(dstDir, "."));
    }

    return tarPath;
  });
  return _createTar.apply(this, arguments);
}

function untar(_x4, _x5) {
  return _untar.apply(this, arguments);
}

function _untar() {
  _untar = _asyncToGenerator(function* (tarPath, dstFolder) {
    var extractedDirPath = yield operations.untarFolder(tarPath, dstFolder);

    if (dstFolder !== extractedDirPath) {
      throw new Error("Extracted content ".concat(extractedDirPath, " was supposed to be in ").concat(dstFolder, "."));
    }

    return extractedDirPath;
  });
  return _untar.apply(this, arguments);
}

function clean(tarPath) {
  if (!fs.existsSync(tarPath)) {
    return;
  }

  utils.deleteFile(tarPath);
  utils.log("File ".concat(tarPath, " deleted."));
}