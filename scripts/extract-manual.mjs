#!/usr/bin/env node
/**
 * Reproducible manual extraction pipeline (Otto-cycle content only).
 *
 * Uses local Poppler tools (pdfinfo, pdftotext, pdfimages, pdftoppm). It does
 * NOT upload the PDF anywhere. Extracted artifacts stay under
 * references/manual/extracted/ (gitignored) and are never bundled.
 *
 * Usage:
 *   node scripts/extract-manual.mjs
 *
 * The reference PDF must be placed at:
 *   references/manual/2019-manual-tecnico-curso-de-motores-web.pdf
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pdfPath = path.join(root, 'references/manual/2019-manual-tecnico-curso-de-motores-web.pdf');
const outDir = path.join(root, 'references/manual/extracted');
const dirs = {
  text: path.join(outDir, 'text'),
  images: path.join(outDir, 'images'),
  pages: path.join(outDir, 'pages'),
};

function has(cmd) {
  try {
    execFileSync(cmd, ['-v'], { stdio: 'ignore' });
    return true;
  } catch {
    try {
      execFileSync(cmd, ['--help'], { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}

function run(cmd, args) {
  console.log(`> ${cmd} ${args.join(' ')}`);
  execFileSync(cmd, args, { stdio: 'inherit' });
}

function main() {
  if (!existsSync(pdfPath)) {
    console.error(`\nReference PDF not found at:\n  ${pdfPath}\n`);
    console.error('Place the manual there (it is gitignored) and re-run.');
    process.exit(1);
  }

  for (const d of Object.values(dirs)) mkdirSync(d, { recursive: true });

  const poppler = ['pdfinfo', 'pdftotext', 'pdfimages', 'pdftoppm'].filter((c) => !has(c));
  if (poppler.length) {
    console.error(`\nMissing Poppler tools: ${poppler.join(', ')}`);
    console.error('Install Poppler:');
    console.error('  Windows:  winget install oschwartz10612.Poppler  (or add poppler to PATH)');
    console.error('  macOS:    brew install poppler');
    console.error('  Linux:    sudo apt-get install poppler-utils');
    process.exit(1);
  }

  run('pdfinfo', [pdfPath]);
  run('pdftotext', ['-layout', pdfPath, path.join(dirs.text, 'manual.txt')]);
  run('pdfimages', ['-all', pdfPath, path.join(dirs.images, 'image')]);
  run('pdftoppm', ['-png', '-r', '150', pdfPath, path.join(dirs.pages, 'page')]);

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: path.basename(pdfPath),
    note:
      'Working index only. Classify every item as OTTO_ONLY, DIESEL_ONLY or COMMON before use. ' +
      'DIESEL_ONLY content is ignored. No copyrighted material is redistributed or bundled.',
    outputs: {
      text: path.relative(root, dirs.text),
      images: path.relative(root, dirs.images),
      pages: path.relative(root, dirs.pages),
    },
    pages: [],
  };
  writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nDone. Artifacts under ${path.relative(root, outDir)} (gitignored).`);
}

main();
