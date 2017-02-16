const fs = require('fs');
const path = require('path');
const {
app,
shell,
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
  e.stopPropagation();
  e.preventDefault();
  const element = document.getElementById('statusBox');
  element.innerText = 'Let it go!';
}

function handleDragLeave(e) {
  e.stopPropagation();
  e.preventDefault();
  const element = document.getElementById('statusBox');
  element.innerText = 'Drop client jar here';
}

function handleFileSelection(e) {
  e.stopPropagation();
  e.preventDefault();

  const inputFiles = e.dataTransfer.files;

  const newRP = new JSZip();

  const element = document.getElementById('statusBox');
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
      fs.writeFileSync(dest, file.nodeStream().pipe(fs.createWriteStream(dest)));
    });
    // Walk directories
    folderWalker.on('directory', (root, stat, next) => {
      element.innerText = 'Building resource pack';
      element.className += ' loading';
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
      newRP.generateNodeStream({
        type: 'nodebuffer',
        streamFiles: true,
      }).pipe(fs.createWriteStream('default.zip')).on('finish', () => {
        element.innerText = 'Done!';
        element.className = 'noselect';
        shell.showItemInFolder(`${process.cwd()}/default_resourcepack.zip`);
        setTimeout(() => {
          element.innerText = 'Drop client jar here';
        }, 3000);
      });
    });
  });
}

// Set up the file drag and drop listeners:
document.getElementsByClassName('content')[0].addEventListener('dragover', handleDragOver, false);
document.getElementsByClassName('content')[0].addEventListener('dragleave', handleDragLeave, false);
document.getElementsByClassName('content')[0].addEventListener('drop', handleFileSelection, false);
