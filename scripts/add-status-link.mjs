/**
 * Add "— Status" link to all HTML page footers.
 * Run: node scripts/add-status-link.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// All HTML files to update
const files = [
  // DE locale
  'public/designed/de/homepage.html',
  'public/designed/de/loesungen.html',
  'public/designed/de/referenzen.html',
  'public/designed/de/preise.html',
  'public/designed/de/fallstudie.html',
  'public/designed/de/kontakt.html',
  // EN locale
  'public/designed/en/homepage.html',
  'public/designed/en/loesungen.html',
  'public/designed/en/referenzen.html',
  'public/designed/en/preise.html',
  'public/designed/en/fallstudie.html',
  'public/designed/en/kontakt.html',
  // TR locale
  'public/designed/tr/homepage.html',
  'public/designed/tr/loesungen.html',
  'public/designed/tr/referenzen.html',
  'public/designed/tr/preise.html',
  'public/designed/tr/fallstudie.html',
  'public/designed/tr/kontakt.html',
  // Legacy root files
  'public/designed/homepage.html',
  'public/designed/loesungen.html',
  'public/designed/referenzen.html',
  'public/designed/preise.html',
  'public/designed/fallstudie.html',
  'public/designed/kontakt.html',
];

const STATUS_LINK = `<a href="/de/hinweis" style="font-family:'Geist Mono',monospace; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.5); text-decoration:none; transition:color .2s;" onmouseover="this.style.color='#3DD9C4'" onmouseout="this.style.color='rgba(255,255,255,0.5)'">\u2014 Status</a>`;

let updated = 0;
let skipped = 0;

for (const rel of files) {
  const abs = resolve(ROOT, rel);
  let html;
  try {
    html = readFileSync(abs, 'utf-8');
  } catch {
    console.log(`⏩ SKIP (not found): ${rel}`);
    skipped++;
    continue;
  }

  // Skip if already has the status link
  if (html.includes('— Status') || html.includes('\u2014 Status')) {
    // Check if it's the hinweis page itself — make the link active (mint color)
    if (rel.includes('hinweis')) {
      console.log(`⏩ SKIP (is hinweis page): ${rel}`);
      skipped++;
      continue;
    }
    console.log(`⏩ SKIP (already has status link): ${rel}`);
    skipped++;
    continue;
  }

  let modified = false;

  // Pattern 1: kontakt-style footer with footer-legal
  // <span style="...">entwickelt in Linz · AT</span>
  //   </div> (footer-legal close)
  const kontaktPattern = /(<span[^>]*>entwickelt in Linz · AT<\/span>\s*\n?\s*<\/div>)/;
  if (kontaktPattern.test(html)) {
    html = html.replace(kontaktPattern, (match, group) => {
      return group.replace('</div>', `\n        ${STATUS_LINK}\n      </div>`);
    });
    modified = true;
  }

  // Pattern 2: foot-bar style with <span class="mono">entwickelt in Linz, AT · hosted on Vercel</span>
  const footBarPattern = /(<span class="mono">entwickelt in Linz, AT · hosted on Vercel<\/span>)/;
  if (!modified && footBarPattern.test(html)) {
    html = html.replace(footBarPattern, (match) => {
      return `${match}\n      ${STATUS_LINK}`;
    });
    modified = true;
  }

  // Pattern 2b: EN version
  const footBarPatternEN = /(<span class="mono">built in Linz, AT · hosted on Vercel<\/span>)/;
  if (!modified && footBarPatternEN.test(html)) {
    html = html.replace(footBarPatternEN, (match) => {
      return `${match}\n      ${STATUS_LINK}`;
    });
    modified = true;
  }

  // Pattern 2c: TR version
  const footBarPatternTR = /(<span class="mono">Linz, AT'de geliştirildi · Vercel'de barındırılıyor<\/span>)/i;
  if (!modified && footBarPatternTR.test(html)) {
    html = html.replace(footBarPatternTR, (match) => {
      return `${match}\n      ${STATUS_LINK}`;
    });
    modified = true;
  }

  // Pattern 3: EN kontakt-style
  const enKontaktPattern = /(<span[^>]*>built in Linz · AT<\/span>\s*\n?\s*<\/div>)/;
  if (!modified && enKontaktPattern.test(html)) {
    html = html.replace(enKontaktPattern, (match, group) => {
      return group.replace('</div>', `\n        ${STATUS_LINK}\n      </div>`);
    });
    modified = true;
  }

  // Pattern 4: TR kontakt-style
  const trKontaktPattern = /(<span[^>]*>Linz · AT'de geliştirildi<\/span>\s*\n?\s*<\/div>)/i;
  if (!modified && trKontaktPattern.test(html)) {
    html = html.replace(trKontaktPattern, (match, group) => {
      return group.replace('</div>', `\n        ${STATUS_LINK}\n      </div>`);
    });
    modified = true;
  }

  // Generic fallback: look for any "entwickelt" or "built" or "geliştirildi" text in the footer area
  if (!modified) {
    // Try to find the footer-legal or foot-bar closing pattern more broadly
    const genericDevelopedPattern = /(entwickelt[^<]*<\/span>)/i;
    if (genericDevelopedPattern.test(html)) {
      html = html.replace(genericDevelopedPattern, (match) => {
        return `${match}\n        ${STATUS_LINK}`;
      });
      modified = true;
    }
  }

  if (!modified) {
    const genericBuiltPattern = /(built[^<]*<\/span>)/i;
    if (genericBuiltPattern.test(html)) {
      html = html.replace(genericBuiltPattern, (match) => {
        return `${match}\n        ${STATUS_LINK}`;
      });
      modified = true;
    }
  }

  if (!modified) {
    const genericTRPattern = /(geliştirildi[^<]*<\/span>)/i;
    if (genericTRPattern.test(html)) {
      html = html.replace(genericTRPattern, (match) => {
        return `${match}\n        ${STATUS_LINK}`;
      });
      modified = true;
    }
  }

  if (modified) {
    writeFileSync(abs, html, 'utf-8');
    console.log(`✓ Updated: ${rel}`);
    updated++;
  } else {
    console.log(`⚠ Could not find footer pattern: ${rel}`);
    skipped++;
  }
}

console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`);
