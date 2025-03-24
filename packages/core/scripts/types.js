import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

async function generateTypes() {
  try {
    console.log('Generating type declarations...');
    await execAsync('tsc --emitDeclarationOnly --declaration --project tsconfig.build.json', {
      cwd: root
    });
    console.log('Type declarations generated successfully!');
  } catch (error) {
    console.error('Failed to generate type declarations:', error.message);
    process.exit(1);
  }
}

export { generateTypes }; 