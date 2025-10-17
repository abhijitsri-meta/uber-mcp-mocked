#!/usr/bin/env node

import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ASSETS_DIR = join(__dirname, 'widget-assets');
const PORT = 3000;

const MIME_TYPES = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.json': 'application/json',
};

const server = createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  // Remove leading slash and query string
  const pathname = req.url.split('?')[0].slice(1) || 'index.html';
  const filePath = join(ASSETS_DIR, pathname);

  // Security check: ensure path is within ASSETS_DIR
  if (!filePath.startsWith(ASSETS_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  if (!existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }

  try {
    const content = readFileSync(filePath);
    const ext = pathname.substring(pathname.lastIndexOf('.'));
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(content);

    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - 200`);
  } catch (error) {
    console.error(`Error serving ${pathname}:`, error.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`Widget asset server running at http://localhost:${PORT}/`);
  console.log(`Serving files from: ${ASSETS_DIR}`);
  console.log(`\nAvailable assets:`);
  console.log(`  - http://localhost:${PORT}/ride-estimate.js`);
  console.log(`  - http://localhost:${PORT}/ride-estimate.css`);
});
