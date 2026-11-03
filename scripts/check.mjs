#!/usr/bin/env node
// Dependency-free release checks for Gutenberg Reader Studio & Vocabulary Lab.
//
//   node scripts/check.mjs
//
// Exit codes: 0 all checks passed, 1 any failure.
// No network access, no npm packages, no build step.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const checks = [];
const failures = [];

function pass(label) {
  checks.push(label);
}

function fail(label, detail = '') {
  checks.push(label);
  failures.push(detail ? `${label} — ${detail}` : label);
}

function check(label, fn) {
  try {
    const result = fn();
    if (result === false) fail(label);
    else pass(label);
  } catch (error) {
    fail(label, error.message);
  }
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', '.venv', 'venv', '__pycache__', '.DS_Store'].includes(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function isExternal(target) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(target) || target.startsWith('/');
}

function stripCode(text) {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]*`/g, '');
}

function localPath(fromFile, target) {
  const clean = target
    .replace(/^<|>$/g, '')
    .split(/\s+/)[0]
    .split('#')[0]
    .split('?')[0];
  if (!clean || isExternal(clean)) return null;
  try {
    return resolve(dirname(fromFile), decodeURIComponent(clean));
  } catch {
    return resolve(dirname(fromFile), clean);
  }
}

/* 1. Required files ------------------------------------------------------- */
const required = [
  'index.html',
  'style.css',
  'script.js',
  'README.md',
  'AGENTS.md',
  'LICENSE',
  'CHANGELOG.md',
  '.nojekyll',
  'favicon.svg',
  'state.json',
  'docs/ARCHITECTURE.md',
  'docs/REPRODUCTION.md',
  'docs/DEPLOYMENT.md',
  'docs/TESTING.md',
  'skills/gutenberg-reader-studio/SKILL.md',
  'skills/gutenberg-reader-studio/ATTRIBUTION.md',
  'skills/gutenberg-reader-studio/references/method.md',
  'skills/gutenberg-reader-studio/references/lessons.md',
  'skills/gutenberg-reader-studio/references/verification.md',
  'skills/gutenberg-reader-studio/assets/template/index.html',
  'skills/gutenberg-reader-studio/assets/template/style.css',
  'skills/gutenberg-reader-studio/assets/template/script.js',
];

for (const file of required) {
  check(`required ${file}`, () => {
    if (!existsSync(join(root, file))) throw new Error('missing');
    return true;
  });
}

/* 2. Local assets referenced by index.html -------------------------------- */
const htmlFile = join(root, 'index.html');
if (existsSync(htmlFile)) {
  const html = readFileSync(htmlFile, 'utf8');
  const refs = [...html.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
  const seen = new Set();
  for (const ref of refs) {
    const target = localPath(htmlFile, ref);
    if (!target || seen.has(target)) continue;
    seen.add(target);
    check(`asset ${relative(root, target)}`, () => {
      if (!existsSync(target)) throw new Error(`referenced by index.html as "${ref}"`);
      return true;
    });
  }
}

/* 3. Relative Markdown links and images ----------------------------------- */
const markdownFiles = [join(root, 'README.md'), join(root, 'AGENTS.md')];
const docsDir = join(root, 'docs');
if (existsSync(docsDir)) {
  for (const entry of readdirSync(docsDir)) {
    if (extname(entry).toLowerCase() === '.md') markdownFiles.push(join(docsDir, entry));
  }
}

for (const file of markdownFiles) {
  if (!existsSync(file)) continue;
  const text = stripCode(readFileSync(file, 'utf8'));
  const links = [...text.matchAll(/!?\[[^\]]*\]\(\s*([^)\s]+)(?:\s+["'][^"']*["'])?\s*\)/g)].map((match) => match[1]);
  const htmlRefs = [...text.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const ref of [...links, ...htmlRefs]) {
    const target = localPath(file, ref);
    if (!target) continue;
    check(`link ${relative(root, file)} -> ${relative(root, target)}`, () => {
      if (!existsSync(target)) throw new Error(`target does not exist: ${ref}`);
      return true;
    });
  }
}

/* 4. JavaScript syntax ---------------------------------------------------- */
for (const file of walk(root).filter((path) => extname(path) === '.js')) {
  check(`syntax ${relative(root, file)}`, () => {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    return true;
  });
}

/* 5. JSON parses ---------------------------------------------------------- */
for (const file of walk(root).filter((path) => extname(path) === '.json')) {
  check(`json ${relative(root, file)}`, () => {
    JSON.parse(readFileSync(file, 'utf8'));
    return true;
  });
}

/* 6. Skill template parity ------------------------------------------------ */
const templateDir = join(root, 'skills/gutenberg-reader-studio/assets/template');
for (const name of ['index.html', 'style.css', 'script.js']) {
  check(`template ${name} byte-identical`, () => {
    const source = readFileSync(join(root, name));
    const template = readFileSync(join(templateDir, name));
    if (!source.equals(template)) throw new Error('template differs from the release source');
    return true;
  });
}

/* Report ------------------------------------------------------------------ */
if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  console.error(`\n${failures.length} failed, ${checks.length - failures.length} passed`);
  process.exit(1);
}

console.log(`OK ${checks.length} checks`);
