const fs = require('fs');
const path = require('path');
const secretFolder = path.join('secret-folder');

fs.readdir(secretFolder, { withFileTypes: true }, (err, files) => {
  if (err) return console.error('Error reading directory:', err);

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(secretFolder, file.name);
      const fileName = path.parse(file.name).name;
      const fileExtension = path.extname(file.name).slice(1);

      fs.stat(filePath, (err, stats) => {
        if (err) return console.error('Error getting file stats:', err);
        const fileSizeInKB = (stats.size / 1024).toFixed(3);
        console.log(`${fileName} - ${fileExtension} - ${fileSizeInKB}kb`);
      });
    }
  });
});
