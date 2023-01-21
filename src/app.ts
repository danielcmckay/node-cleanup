import fs from "fs";
import os from "os";
import notifier from "node-notifier";
import path from "path";
import { exec } from "child_process";

const homedir = os.homedir();

export function doCleanup() {
  try {
    fs.readdir(`${homedir}/Desktop`, (err, files) => {
      let filesChanged = 0;

      if (err) {
        console.log(err);
      } else {
        // Clean up screenshots
        findOrMakeScreenshotsDir(files);
        filesChanged += matchAndMoveFiles(
          files,
          new RegExp(/screen shot/i),
          `${homedir}/Desktop/Screenshots`
        );

        // Clean up documents
        filesChanged += matchAndMoveFiles(
          files,
          new RegExp(/\.docx?$/i),
          `${homedir}/Documents`
        );

        // Clean up images
        filesChanged += matchAndMoveFiles(
          files,
          new RegExp(/\.(png|jpg|jpeg)$/i),
          `${homedir}/Pictures`
        );

        // Clean up videos
        filesChanged += matchAndMoveFiles(
          files,
          new RegExp(/\.(mp4|mov)$/i),
          `${homedir}/Movies`
        );

        fireNotification(
          `Moved ${pluralize(filesChanged, "file")}!`
        );
      }
    });
  } catch (err) {
    fireNotification("Error: " + err);
  }
}

function matchAndMoveFiles(
  files: string[],
  pattern: RegExp,
  destination: string
): number {
  console.log(`Matching files with pattern ${pattern}`);

  const matchedFiles = matchFiles(files, pattern);

  moveFiles(matchedFiles, destination);

  console.log(`Matched ${matchedFiles.length} files, moved to ${destination}`);

  return matchedFiles.length;
}

export function findOrMakeScreenshotsDir(files: string[]) {
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

export function matchFiles(files: string[], pattern: RegExp): string[] {
  return files.filter((file) => pattern.test(file));
}

export function moveFiles(files: string[], destination: string) {
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

function fireNotification(message: string) {
  notifier.notify({
    title: "Desktop cleanup",
    message,
    timeout: 10,
    icon: path.join(__dirname, "/assets/app-icon.png"),
    actions: ["View in Finder"],
    sound: "Bubble",
  });
}

notifier.on("click", function (_, __, event) {
  if (event.activationType === "actionClicked") {
    exec(`open ${homedir}/Desktop`);
  }
});

function pluralize(count: number, noun: string, suffix = "s") {
  return `${count} ${noun}${count !== 1 ? suffix : ""}`;
}

doCleanup();
