#!/usr/bin/env node
const { readdirSync } = require("fs");
const { join, relative } = require("path");
const { spawnSync } = require('child_process');

const root = join(__dirname, '..');
const ignoredDirectories = new Set(['.git', 'node_modules', 'reports']);
const files = [];
const typeScriptFiles = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) walk(file);
    } else if (entry.name.endsWith('.js')) {
      files.push(file);
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      typeScriptFiles.push(relative(root, file));
    }
  }
}
walk(root);

const failures = [];
if (typeScriptFiles.length) failures.push(`TypeScript files remain:\n${typeScriptFiles.join('\n')}`);
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    failures.push(`${relative(root, file)}\n${result.stderr || result.stdout}`);
  }
}

console.log(`Checked JavaScript syntax in ${files.length} files.`);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('OK: all JavaScript files parse successfully.');
