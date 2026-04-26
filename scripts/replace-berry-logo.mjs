/**
 * Replace CSS .berry spans with actual logo.png image in nav/footer across all HTML files.
 * Run: node scripts/replace-berry-logo.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const files = [
  // DE
  'public/designed/de/homepage.html',
  'public/designed/de/loesungen.html',
  'public/designed/de/referenzen.html',
  'public/designed/de/preise.html',
  'public/designed/de/fallstudie.html',
  'public/designed/de/kontakt.html',
  'public/designed/de/hinweis.html',
  // EN
  'public/designed/en/homepage.html',
  'public/designed/en/loesungen.html',
  'public/designed/en/referenzen.html',
  'public/designed/en/preise.html',
  'public/designed/en/fallstudie.html',
  'public/designed/en/kontakt.html',
  // TR
  'public/designed/tr/homepage.html',
  'public/designed/tr/loesungen.html',
  'public/designed/tr/referenzen.html',
  'public/designed/tr/preise.html',
  'public/designed/tr/fallstudie.html',
  'public/designed/tr/kontakt.html',
  // Legacy
  'public/designed/homepage.html',
  'public/designed/loesungen.html',
  'public/designed/referenzen.html',
  'public/designed/preise.html',
  'public/designed/fallstudie.html',
  'public/designed/kontakt.html',
];

const IMG_TAG = '<img src="/logo/logo.png" alt="" aria-hidden="true" style="width:32px;height:32px;object-fit:contain;border-radius:0;background:none;box-shadow:none;">';
const IMG_TAG_FOOTER = '<img src="/logo/logo.png" alt="" aria-hidden="true" style="width:24px;height:24px;object-fit:contain;border-radius:0;background:none;box-shadow:none;">';

let updated = 0;

for (const rel of files) {
  const abs = resolve(ROOT, rel);
  let html;
  try { html = readFileSync(abs, 'utf-8'); } catch { continue; }

  let changed = false;

  // Pattern 1: Nav berry — <span class="berry" aria-hidden="true"></span>
  if (html.includes('<span class="berry" aria-hidden="true"></span>')) {
    // Only replace the FIRST occurrence (nav), leave footer ones for separate handling
    let count = 0;
    html = html.replace(/<span class="berry" aria-hidden="true"><\/span>/g, (match) => {
      count++;
      if (count === 1) {
        // This is the nav berry
        return IMG_TAG;
      }
      // Footer berry (smaller)
      return IMG_TAG_FOOTER;
    });
    changed = true;
  }

  // Pattern 2: Berry without aria-hidden — <span class="berry"></span>
  if (html.includes('<span class="berry"></span>')) {
    html = html.replace(/<span class="berry"><\/span>/g, IMG_TAG_FOOTER);
    changed = true;
  }

  if (changed) {
    writeFileSync(abs, html, 'utf-8');
    console.log(`✓ ${rel}`);
    updated++;
  } else {
    console.log(`⏩ ${rel} (no berry found)`);
  }
}

console.log(`\nDone! Updated: ${updated}`);
