/**
 * Remove wordmark text from nav, make logo.png full-width natural display.
 * Run: node scripts/fix-nav-logo.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const files = [
  'public/designed/de/homepage.html',
  'public/designed/de/loesungen.html',
  'public/designed/de/referenzen.html',
  'public/designed/de/preise.html',
  'public/designed/de/fallstudie.html',
  'public/designed/en/homepage.html',
  'public/designed/en/loesungen.html',
  'public/designed/en/referenzen.html',
  'public/designed/en/preise.html',
  'public/designed/en/fallstudie.html',
  'public/designed/tr/homepage.html',
  'public/designed/tr/loesungen.html',
  'public/designed/tr/referenzen.html',
  'public/designed/tr/preise.html',
  'public/designed/tr/fallstudie.html',
  'public/designed/homepage.html',
  'public/designed/loesungen.html',
  'public/designed/referenzen.html',
  'public/designed/preise.html',
  'public/designed/fallstudie.html',
];

let updated = 0;

for (const rel of files) {
  const abs = resolve(ROOT, rel);
  let html;
  try { html = readFileSync(abs, 'utf-8'); } catch { continue; }

  let changed = false;

  // 1. Replace the nav logo img — make it taller, auto width so it shows naturally
  const oldNavImg = '<img src="/logo/logo.png" alt="" aria-hidden="true" style="width:32px;height:32px;object-fit:contain;border-radius:0;background:none;box-shadow:none;">';
  const newNavImg = '<img src="/logo/logo.png" alt="Buckberry Labs" style="height:36px;width:auto;object-fit:contain;">';
  if (html.includes(oldNavImg)) {
    // Only replace first occurrence (nav), keep footer as-is
    html = html.replace(oldNavImg, newNavImg);
    changed = true;
  }

  // 2. Remove the wordmark span after the nav logo
  // Pattern: <img ...logo.png...>\n      <span class="wordmark">buckberry</span>
  const wordmarkPattern = /(<img src="\/logo\/logo\.png"[^>]*>)\s*\n?\s*<span class="wordmark">buckberry<\/span>/;
  if (wordmarkPattern.test(html)) {
    html = html.replace(wordmarkPattern, '$1');
    changed = true;
  }

  if (changed) {
    writeFileSync(abs, html, 'utf-8');
    console.log(`✓ ${rel}`);
    updated++;
  } else {
    console.log(`⏩ ${rel}`);
  }
}

console.log(`\nDone! Updated: ${updated}`);
