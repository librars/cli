"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zipFolder = zipFolder;

/**
 * operations.js
 * Andrea Tino - 2020
 * 
 * Operations.
 */
var fs = require("fs");

var path = require("path");

var zip = require("archiver");

var utils = require("./utils");
/**
 * Generates a zip archive of a folder.
 * 
 * @param {string} src The path to the directory to zip.
 * @param {string} dst The path to the directory where the zip will be saved.
 * @param {string} name The name to assign to the generated zip (not inclusive of extension).
 * @returns {string} The path pointing to the newly created zip.
 */


function zipFolder(src, dst, name) {
  var dstZipPath = path.join(path.normalize(dst), "".concat(name, ".zip"));
  var output = fs.createWriteStream(dstZipPath); // Prepare destination

  var archive = zip("zip"); // Create a new zip archive

  output.on("close", () => {
    utils.log("".concat(archive.pointer(), " total bytes written."));
  });
  archive.on("error", err => {
    utils.error("An error occurred while zipping ".concat(src, ": ").concat(err, "."));
    throw err; // Display stack
  }); // Initiate zip creation

  archive.pipe(output); // Get all the files to add to the archive

  var files = utils.getAllFIlesInDirRecursively(src);
  console.log("Found ".concat(files.length, " files to zip.")); // Add files into the archive

  for (var i = 0; i < files.length; i++) {
    archive.append(fs.createReadStream(files[i])
    /*, { name: "file1.txt" }*/
    );
  }

  archive.finalize();
  return dstZipPath;
}