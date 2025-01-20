const fs = require('fs');
const path = require('path');

async function buildPage() {
  const projectDist = path.join(__dirname, 'project-dist');
  const templateFile = path.join(__dirname, 'template.html');
  const componentsDir = path.join(__dirname, 'components');
  const stylesDir = path.join(__dirname, 'styles');
  const assetsDir = path.join(__dirname, 'assets');
  const outputHTML = path.join(projectDist, 'index.html');
  const outputCSS = path.join(projectDist, 'style.css');
  const outputAssets = path.join(projectDist, 'assets');

  try {
    await fs.promises.mkdir(projectDist, { recursive: true });
    let templateContent = await fs.promises.readFile(templateFile, 'utf-8');
    const tagRegex = /{{(\w+)}}/g;
    let match;
    while ((match = tagRegex.exec(templateContent)) !== null) {
      const tagName = match[1];
      const componentFile = path.join(componentsDir, `${tagName}.html`);
      try {
        const componentContent = await fs.promises.readFile(
          componentFile,
          'utf-8',
        );
        templateContent = templateContent.replace(match[0], componentContent);
      } catch (err) {
        console.warn(`Component for tag {{${tagName}}} not found. Skipping.`);
      }
    }

    await fs.promises.writeFile(outputHTML, templateContent);
    const styleFiles = await fs.promises.readdir(stylesDir, {
      withFileTypes: true,
    });
    const styleStream = fs.createWriteStream(outputCSS);

    for (const file of styleFiles) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const styleContent = await fs.promises.readFile(
          path.join(stylesDir, file.name),
          'utf-8',
        );
        styleStream.write(styleContent + '\n');
      }
    }

    styleStream.end();
    await copyAssets(assetsDir, outputAssets);

    console.log('Page built successfully.');
  } catch (err) {
    console.error('Error building page:', err);
  }
}

async function copyAssets(source, destination) {
  await fs.promises.mkdir(destination, { recursive: true });
  const items = await fs.promises.readdir(source, { withFileTypes: true });

  for (const item of items) {
    const sourcePath = path.join(source, item.name);
    const destinationPath = path.join(destination, item.name);

    if (item.isDirectory()) await copyAssets(sourcePath, destinationPath);
    else await fs.promises.copyFile(sourcePath, destinationPath);
  }
}

buildPage();
