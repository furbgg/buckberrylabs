import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const files = [
  'public/designed/de/homepage.html','public/designed/de/loesungen.html','public/designed/de/referenzen.html',
  'public/designed/de/preise.html','public/designed/de/fallstudie.html',
  'public/designed/en/homepage.html','public/designed/en/loesungen.html','public/designed/en/referenzen.html',
  'public/designed/en/preise.html','public/designed/en/fallstudie.html',
  'public/designed/tr/homepage.html','public/designed/tr/loesungen.html','public/designed/tr/referenzen.html',
  'public/designed/tr/preise.html','public/designed/tr/fallstudie.html',
  'public/designed/homepage.html','public/designed/loesungen.html','public/designed/referenzen.html',
  'public/designed/preise.html','public/designed/fallstudie.html',
];
let n = 0;
for (const f of files) {
  const abs = resolve(ROOT, f);
  try {
    let h = readFileSync(abs, 'utf-8');
    const old = 'height:36px;width:auto;object-fit:contain;';
    const neu = 'height:44px;width:auto;object-fit:contain;';
    if (h.includes(old)) {
      // Only replace the FIRST occurrence (nav logo), not footer
      h = h.replace(old, neu);
      writeFileSync(abs, h);
      console.log('✓ ' + f); n++;
    } else { console.log('⏩ ' + f); }
  } catch { console.log('⏩ ' + f); }
}
console.log('Done: ' + n);
