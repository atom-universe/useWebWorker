import { minify } from 'terser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bundlePath = path.resolve(__dirname, '../dist/bundle.js');
const minifiedPath = path.resolve(__dirname, '../dist/bundle.min.js');

async function minifyBundle() {
  console.log('Reading bundle...');
  const code = fs.readFileSync(bundlePath, 'utf8');

  console.log('Minifying bundle...');
  const result = await minify(code, {
    compress: {
      drop_console: true,
      drop_debugger: true,
      pure_getters: true,
      unsafe: true,
      unsafe_arrows: true,
      unsafe_comps: true,
      unsafe_Function: true,
      unsafe_math: true,
      unsafe_methods: true,
      unsafe_proto: true,
      unsafe_regexp: true,
      unsafe_undefined: true,
      passes: 3,
    },
    mangle: {
      properties: {
        regex: /^_/,
      },
    },
    format: {
      comments: false,
      ecma: 2020,
    },
    ecma: 2020,
    module: true,
  });

  if (result.code) {
    fs.writeFileSync(minifiedPath, result.code);
    console.log(`Original size: ${(code.length / 1024).toFixed(2)} KB`);
    console.log(`Minified size: ${(result.code.length / 1024).toFixed(2)} KB`);
    console.log(`Reduction: ${(100 - (result.code.length / code.length) * 100).toFixed(2)}%`);

    // 更新package.json以使用最小化版本
    const packageJsonPath = path.resolve(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.exports['.'].import = './dist/bundle.min.js';
    packageJson.exports['.'].default = './dist/bundle.min.js';
    packageJson.main = './dist/bundle.min.js';

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Updated package.json to use minified bundle');
  } else {
    console.error('Minification failed');
  }
}

minifyBundle().catch(console.error);
