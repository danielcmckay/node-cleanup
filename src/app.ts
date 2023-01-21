import fs from "fs";
import os from "os";

const homedir = os.homedir();

function doCleanup() {
  fs.readdir(`${homedir}/Desktop`, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      // Clean up screenshots
      findOrMakeScreenshotsDir(files);
      matchAndMoveFiles(
        files,
        new RegExp(/screen shot/i),
        `${homedir}/Desktop/Screenshots`
      );

      // Clean up documents
      matchAndMoveFiles(files, new RegExp(/\.docx?$/i), `${homedir}/Documents`);

      // Clean up images
      matchAndMoveFiles(
        files,
        new RegExp(/\.(png|jpg|jpeg)$/i),
        `${homedir}/Pictures`
      );

      // Clean up videos
      matchAndMoveFiles(
        files,
        new RegExp(/\.(mp4|mov)$/i),
        `${homedir}/Movies`
      );
    }
  });
}

function matchAndMoveFiles(
  files: string[],
  pattern: RegExp,
  destination: string
) {
  console.log(`Matching files with pattern ${pattern}`);

  const matchedFiles = matchFiles(files, pattern);

  moveFiles(matchedFiles, destination);

  console.log(`Matched ${matchedFiles.length} files, moved to ${destination}`);
}

function findOrMakeScreenshotsDir(files: string[]) {
  if (!files.includes("Screenshots")) {
    fs.mkdir(`${homedir}/Desktop/Screenshots`, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Screenshots directory created");
      }
    });
  }
}

function matchFiles(files: string[], pattern: RegExp): string[] {
  return files.filter((file) => pattern.test(file));
}

function moveFiles(files: string[], destination: string) {
  files.forEach((file) => {
    fs.rename(`${homedir}/Desktop/${file}`, `${destination}/${file}`, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("file moved");
      }
    });
  });
}

doCleanup();
