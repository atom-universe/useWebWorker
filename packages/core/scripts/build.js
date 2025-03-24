import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
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
    process.exit(1);
  }
}

build(); 