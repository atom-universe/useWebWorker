import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '../../..');
const coreDir = path.resolve(__dirname, '..');

const files = ['README.md', 'README_CN.md'];

files.forEach(file => {
  const sourcePath = path.join(rootDir, file);
  const targetPath = path.join(coreDir, file);

  try {
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Source file ${file} does not exist`);
    }

    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }

    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ Successfully copied ${file}`);
  } catch (error) {
    console.error(`❌ Failed to copy ${file}:`, error);
    process.exit(1);
  }
});
