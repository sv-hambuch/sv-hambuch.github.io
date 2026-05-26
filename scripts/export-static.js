const fs = require('fs/promises');
const path = require('path');
const app = require('../server');

const rootDir = path.join(__dirname, '..');
const outputDir = path.join(rootDir, 'docs');
const publicDir = path.join(rootDir, 'public');

const routes = [
  '/',
  '/kontakt',
  '/impressum',
  '/datenschutz'
];

const toOutputPath = (route) => {
  if (route === '/') {
    return path.join(outputDir, 'index.html');
  }

  return path.join(outputDir, route.replace(/^\//, ''), 'index.html');
};

const writePage = async (route, html) => {
  const filePath = toOutputPath(route);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, html);
};

const copyPublicAssets = async () => {
  await fs.cp(publicDir, outputDir, { recursive: true });
  await removeUnusedAnniversaryImages();
  await fs.writeFile(path.join(outputDir, '.nojekyll'), '');
};

const removeUnusedAnniversaryImages = async () => {
  const anniversaryDir = path.join(outputDir, 'images', 'anniversary');
  const files = await fs.readdir(anniversaryDir);

  await Promise.all(
    files
      .filter((file) => /_2\.png$/i.test(file) || /\.jpe?g$/i.test(file))
      .map((file) => fs.rm(path.join(anniversaryDir, file), { force: true }))
  );
};

const extractInternalRoutes = (html) => {
  const matches = html.matchAll(/href="([^"#?]+)(?:#[^"]*)?"/g);
  const discovered = [];

  for (const match of matches) {
    const href = match[1];

    if (
      href.startsWith('/') &&
      !href.includes('.') &&
      !routes.includes(href)
    ) {
      discovered.push(href);
    }
  }

  return discovered;
};

const exportSite = async () => {
  await fs.rm(outputDir, { recursive: true, force: true });
  await copyPublicAssets();

  const server = app.listen(0);
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  const queue = [...routes];
  const visited = new Set();

  try {
    while (queue.length > 0) {
      const route = queue.shift();

      if (visited.has(route)) {
        continue;
      }

      visited.add(route);

      const response = await fetch(`${baseUrl}${route}`, {
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`Failed to export ${route}: ${response.status}`);
      }

      const html = await response.text();
      await writePage(route, html);

      for (const discoveredRoute of extractInternalRoutes(html)) {
        if (!visited.has(discoveredRoute)) {
          queue.push(discoveredRoute);
        }
      }
    }
  } finally {
    server.close();
  }

  console.log(`Exported ${visited.size} pages to ${path.relative(rootDir, outputDir)}`);
};

exportSite().catch((error) => {
  console.error(error);
  process.exit(1);
});
