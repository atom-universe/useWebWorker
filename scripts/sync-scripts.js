#!/usr/bin/env node

/**
 * Script to sync package scripts from sub-packages to root package.json
 * Usage: node scripts/sync-scripts.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read root package.json
const rootPackagePath = path.join(__dirname, '..', 'package.json');
const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));

// Initialize scripts object if it doesn't exist
rootPackage.scripts = rootPackage.scripts || {};

// Get all sub-packages
const packagesDir = path.join(__dirname, '..', 'packages');
const subPackages = fs
  .readdirSync(packagesDir)
  .filter(item => fs.statSync(path.join(packagesDir, item)).isDirectory());

console.log('Found sub-packages:', subPackages);

// For each sub-package, read its package.json and sync scripts
for (const pkg of subPackages) {
  const pkgPath = path.join(packagesDir, pkg, 'package.json');

  if (fs.existsSync(pkgPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

      // Skip if no scripts
      if (!packageJson.scripts) continue;

      console.log(`Processing ${pkg} scripts...`);

      // Add scripts with package prefix
      for (const [scriptName, scriptCmd] of Object.entries(packageJson.scripts)) {
        const prefixedScriptName = `${pkg}:${scriptName}`;

        // Skip if script already exists with same command
        if (rootPackage.scripts[prefixedScriptName] === scriptCmd) {
          continue;
        }

        // Add or update script
        rootPackage.scripts[prefixedScriptName] = `cd packages/${pkg} && pnpm ${scriptName}`;
        console.log(`  Added/Updated: ${prefixedScriptName}`);
      }
    } catch (error) {
      console.error(`Error processing ${pkg}:`, error.message);
    }
  }
}

// Write back to root package.json
fs.writeFileSync(rootPackagePath, JSON.stringify(rootPackage, null, 2) + '\n');
console.log('Root package.json updated successfully!');
