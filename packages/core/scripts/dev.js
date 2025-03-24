import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { watch } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

async function build() {
  try {
    console.log('Compiling TypeScript to JavaScript...');
    await execAsync('tsc --project tsconfig.build.json', {
      cwd: root
    });
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
  }
}

async function watchFiles() {
  const watcher = watch(resolve(root, 'src'), { recursive: true });
  console.log('Watching for file changes...');

  try {
    for await (const event of watcher) {
      if (event.filename.endsWith('.ts') || event.filename.endsWith('.tsx')) {
        console.log(`\nFile changed: ${event.filename}`);
        await build();
      }
    }
  } catch (error) {
    console.error('Watch error:', error);
    process.exit(1);
  }
}

// Initial build
await build();

// Start watching if --watch flag is present
if (process.argv.includes('--watch')) {
  watchFiles();
} 