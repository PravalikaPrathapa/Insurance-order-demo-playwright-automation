#!/usr/bin/env node
const { readdirSync, readFileSync } = require("fs");
const { join, relative } = require("path");

const testDir = join(__dirname, '..', 'tests');
const files = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.spec.js')) files.push(file);
  }
}
walk(testDir);

const cases = new Map();
const failures = [];
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  let fileCaseCount = 0;
  for (const line of lines) {
    const match = line.match(/"(TC-[A-Z]+-\d+) \| [^"]+ \|/);
    if (!match) continue;
    const id = match[1];
    fileCaseCount += 1;
    if (!line.includes(' | Verify that ')) failures.push(`Test name was not updated for ${id}`);
    if (cases.has(id)) failures.push(`Duplicate case ID ${id} in ${relative(testDir, file)}`);
    cases.set(id, line);
  }
  if (fileCaseCount === 0) failures.push(`No retained test cases in ${relative(testDir, file)}`);
}

const regressionCount = [...cases.values()].filter((line) => line.includes('"@regression"')).length;
const smokeCount = [...cases.values()].filter((line) => line.includes('"@smoke"')).length;
for (const [label, actual, expected] of [
  ['scenario', cases.size, 50],
  ['regression', regressionCount, 50],
  ['smoke', smokeCount, 15],
]) {
  if (actual !== expected) failures.push(`Expected ${expected} ${label} cases; found ${actual}`);
}

console.log(`JavaScript test specs: ${files.length}; regression: ${regressionCount}; smoke: ${smokeCount}`);
if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}
console.log('OK: every case ID is unique and suite tags have the expected counts.');
