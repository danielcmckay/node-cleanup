"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveFiles = exports.matchFiles = exports.findOrMakeScreenshotsDir = exports.doCleanup = void 0;
var fs_1 = __importDefault(require("fs"));
var os_1 = __importDefault(require("os"));
var homedir = os_1.default.homedir();
function doCleanup() {
    fs_1.default.readdir("".concat(homedir, "/Desktop"), function (err, files) {
        if (err) {
            console.log(err);
        }
        else {
            // Clean up screenshots
            findOrMakeScreenshotsDir(files);
            matchAndMoveFiles(files, new RegExp(/screen shot/i), "".concat(homedir, "/Desktop/Screenshots"));
            // Clean up documents
            matchAndMoveFiles(files, new RegExp(/\.docx?$/i), "".concat(homedir, "/Documents"));
            // Clean up images
            matchAndMoveFiles(files, new RegExp(/\.(png|jpg|jpeg)$/i), "".concat(homedir, "/Pictures"));
            // Clean up videos
            matchAndMoveFiles(files, new RegExp(/\.(mp4|mov)$/i), "".concat(homedir, "/Movies"));
        }
    });
}
exports.doCleanup = doCleanup;
function matchAndMoveFiles(files, pattern, destination) {
    console.log("Matching files with pattern ".concat(pattern));
    var matchedFiles = matchFiles(files, pattern);
    moveFiles(matchedFiles, destination);
    console.log("Matched ".concat(matchedFiles.length, " files, moved to ").concat(destination));
}
function findOrMakeScreenshotsDir(files) {
    if (!files.includes("Screenshots")) {
        fs_1.default.mkdir("".concat(homedir, "/Desktop/Screenshots"), function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Screenshots directory created");
            }
        });
    }
}
exports.findOrMakeScreenshotsDir = findOrMakeScreenshotsDir;
function matchFiles(files, pattern) {
    return files.filter(function (file) { return pattern.test(file); });
}
exports.matchFiles = matchFiles;
function moveFiles(files, destination) {
    files.forEach(function (file) {
        fs_1.default.rename("".concat(homedir, "/Desktop/").concat(file), "".concat(destination, "/").concat(file), function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("file moved");
            }
        });
    });
}
exports.moveFiles = moveFiles;
doCleanup();
