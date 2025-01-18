const fs = require('fs');
const path = require('path');

async function copyDir() {
  const source = path.join(__dirname, 'files');
  const target = path.join(__dirname, 'files-copy');

  try {
    await fs.promises.mkdir(target, { recursive: true });
    const items = await fs.promises.readdir(source, { withFileTypes: true });
    const targetItems = await fs.promises.readdir(target);
    for (const item of targetItems) {
      await fs.promises.rm(path.join(target, item), {
        recursive: true,
        force: true,
      });
    }
    for (const item of items) {
      const sourcePath = path.join(source, item.name);
      const targetPath = path.join(target, item.name);

      if (item.isDirectory()) await copyDirRecursive(sourcePath, targetPath);
      else if (item.isFile())
        await fs.promises.copyFile(sourcePath, targetPath);
    }
  } catch (err) {
    console.error('Error copying directory:', err);
  }
}

async function copyDirRecursive(sourceDir, targetDir) {
  await fs.promises.mkdir(targetDir, { recursive: true });
  const items = await fs.promises.readdir(sourceDir, { withFileTypes: true });

  for (const item of items) {
    const source = path.join(sourceDir, item.name);
    const target = path.join(targetDir, item.name);

    if (item.isDirectory()) await copyDirRecursive(source, target);
    else if (item.isFile()) await fs.promises.copyFile(source, target);
  }
}

copyDir();
