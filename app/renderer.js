const fs = require('fs');
const path = require('path');
const {
app,
} = require('electron').remote;
const JSZip = require('jszip');
const walk = require('walk');

/* global document */

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function handleDragOver(e) {
  e.stopPropagation(); // Do not allow the dragover event to bubble.
  e.preventDefault(); // Prevent default dragover event behavior.
}

function handleFileSelection(e) {
  e.stopPropagation(); // Do not allow the drop event to bubble.
  e.preventDefault(); // Prevent default drop event behavior.

  const inputFiles = e.dataTransfer.files; // Grab the list of files dragged to the drop box.

  const newRP = new JSZip();

  const element = document.getElementById('fileDropBox');
  element.innerText = 'Extracting from jar...';

  new JSZip.external.Promise((resolve, reject) => {
    fs.readFile(inputFiles[0].path, (err, data) => {
      if (err) {
        reject(e);
      } else {
        resolve(data);
      }
    });
  }).then(data => JSZip.loadAsync(data)).then((zip) => {
    const tmpPath = `${app.getPath('temp')}\\erp`;
    const folderWalker = walk.walk(tmpPath, {
      followLinks: false,
    });
    zip.folder('assets').forEach((relativePath, file) => {
      // Extract all files to temp directory
      const dest = path.join(tmpPath, file.name);
      ensureDirectoryExistence(dest);
      fs.writeFileSync(dest, file
        .nodeStream()
        .pipe(fs.createWriteStream(dest)),
      );
    });
    // Walk directories
    folderWalker.on('directory', (root, stat, next) => {
      element.innerText = 'Building resource pack...';
      const folder = newRP.folder(path.relative(`${app.getPath('temp')}/erp`, `${root}/${stat.name}`));
      // Walk the folder for files
      fs.readdir(`${root}/${stat.name}`, (err, files) => {
        if (err) {
          return;
        }
        // Walk files in directory
        files.forEach((file) => {
          const currentFP = `${root}/${stat.name}/${file}`;
          if (fs.statSync(currentFP).isDirectory()) {
            return;
          }
          folder.file(file, fs.readFileSync(currentFP));
        });
      });
      next();
    });
    folderWalker.on('end', () => {
      const mcmeta = `${app.getAppPath()}/assets/pack.mcmeta`;
      const packimg = `${app.getAppPath()}/assets/pack.png`;
      if (fs.existsSync(mcmeta)) {
        newRP.file('pack.mcmeta', fs.readFileSync(mcmeta));
      }
      if (fs.existsSync(packimg)) {
        newRP.file('pack.png', fs.readFileSync(packimg));
      }
      newRP
      .generateNodeStream({
        type: 'nodebuffer',
        streamFiles: true,
      })
      .pipe(fs.createWriteStream('assets/default.zip'))
      .on('finish', () => {
        element.innerText = 'Done!';
      });
    });
  });
}

// Set up the file drag and drop listeners:
document.getElementById('fileDropBox').addEventListener('dragover', handleDragOver, false);
document.getElementById('fileDropBox').addEventListener('drop', handleFileSelection, false);
