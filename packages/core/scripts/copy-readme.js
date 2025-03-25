import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取项目根目录路径（packages/core 的父目录的父目录）
const rootDir = path.resolve(__dirname, '../../..');
const coreDir = path.resolve(__dirname, '..');

// 要复制的文件列表
const files = ['README.md', 'README_CN.md'];

// 复制文件
files.forEach(file => {
  const sourcePath = path.join(rootDir, file);
  const targetPath = path.join(coreDir, file);

  try {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ Successfully copied ${file}`);
  } catch (error) {
    console.error(`❌ Failed to copy ${file}:`, error);
    process.exit(1);
  }
}); 