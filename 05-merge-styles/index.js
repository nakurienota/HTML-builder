const fs = require('fs');
const path = require('path');

async function buildCSSBundle() {
  const stylesDir = path.join(__dirname, 'styles');
  const outputDir = path.join(__dirname, 'project-dist');
  const bundleFile = path.join(outputDir, 'bundle.css');

  try {
    await fs.promises.mkdir(outputDir, { recursive: true });
    const bundleStream = fs.createWriteStream(bundleFile);
    const items = await fs.promises.readdir(stylesDir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(stylesDir, item.name);
      if (item.isFile() && path.extname(item.name) === '.css') {
        const cssContent = await fs.promises.readFile(itemPath, 'utf-8');
        bundleStream.write(cssContent + '\n'); // Add newline between files
      }
    }
    bundleStream.end();
  } catch (err) {
    console.error('Error building CSS bundle:', err);
  }
}

buildCSSBundle();
