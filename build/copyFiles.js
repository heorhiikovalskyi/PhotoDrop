import fs from 'fs';
import path from 'path';

function copyFile(sourcePath, destinationPath) {
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source file '${sourcePath}' does not exist.`);
    return;
  }

  const fileContent = fs.readFileSync(sourcePath);

  fs.writeFileSync(destinationPath, fileContent);

  console.log(`File copied successfully from ${sourcePath} to ${destinationPath}`);
}

const sourceFolder = './';
let fileName = 'distPackage.json';
const destinationFolder = './dist';
let destinationFile = 'package.json';

copyFile(path.join(sourceFolder, fileName), path.join(destinationFolder, destinationFile));

fileName = 'package-lock.json';
destinationFile = fileName;
copyFile(path.join(sourceFolder, fileName), path.join(destinationFolder, destinationFile));
