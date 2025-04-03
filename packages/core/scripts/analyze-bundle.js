import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');

function formatSize(size) {
  return `${(size / 1024).toFixed(2)} KB`;
}

function analyzeFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const gzipped = zlib.gzipSync(content);
  const brotli = zlib.brotliCompressSync(content);

  console.log(`\nFile: ${path.basename(filepath)}`);
  console.log(`Raw size: ${formatSize(content.length)}`);
  console.log(`Gzipped: ${formatSize(gzipped.length)}`);
  console.log(`Brotli: ${formatSize(brotli.length)}`);

  return {
    raw: content.length,
    gzip: gzipped.length,
    brotli: brotli.length,
  };
}

function analyzeBundles() {
  console.log('Analyzing bundles in dist directory...');

  const bundlePath = path.join(distPath, 'bundle.js');
  const minPath = path.join(distPath, 'bundle.min.js');

  if (fs.existsSync(bundlePath)) {
    analyzeFile(bundlePath);
  } else {
    console.log('Original bundle.js not found');
  }

  if (fs.existsSync(minPath)) {
    analyzeFile(minPath);
  } else {
    console.log('Minified bundle.min.js not found');
  }
}

analyzeBundles();
