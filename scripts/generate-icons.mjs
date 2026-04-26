/**
 * Generate all favicon/icon assets from karelogo.png
 * Run: node scripts/generate-icons.mjs
 */
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'public/logo/karelogo.png');

async function main() {
  console.log('Source:', SRC);

  // 1. src/app/icon.png — direct copy at 64x64 for tab favicon
  const iconPath = resolve(ROOT, 'src/app/icon.png');
  await sharp(SRC)
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(iconPath);
  console.log('✓ src/app/icon.png (64×64)');

  // 2. src/app/apple-icon.png — 180×180, logo on #0F1E2E rounded-square bg
  const appleIconPath = resolve(ROOT, 'src/app/apple-icon.png');
  const logoForApple = await sharp(SRC)
    .resize(120, 120, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 15, g: 30, b: 46, alpha: 255 } // #0F1E2E
    }
  })
    .composite([{ input: logoForApple, gravity: 'centre' }])
    .png()
    .toFile(appleIconPath);
  console.log('✓ src/app/apple-icon.png (180×180)');

  // 3. public/icon-192.png — 192×192 PWA icon on #0F1E2E bg
  const icon192Path = resolve(ROOT, 'public/icon-192.png');
  const logoFor192 = await sharp(SRC)
    .resize(140, 140, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 15, g: 30, b: 46, alpha: 255 }
    }
  })
    .composite([{ input: logoFor192, gravity: 'centre' }])
    .png()
    .toFile(icon192Path);
  console.log('✓ public/icon-192.png (192×192)');

  // 4. public/icon-512.png — 512×512 PWA icon on #0F1E2E bg
  const icon512Path = resolve(ROOT, 'public/icon-512.png');
  const logoFor512 = await sharp(SRC)
    .resize(380, 380, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 15, g: 30, b: 46, alpha: 255 }
    }
  })
    .composite([{ input: logoFor512, gravity: 'centre' }])
    .png()
    .toFile(icon512Path);
  console.log('✓ public/icon-512.png (512×512)');

  // 5. public/favicon.ico — multi-res 16/32/48
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map(size =>
      sharp(SRC)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
    )
  );
  const icoBuffer = await pngToIco(pngBuffers);
  const faviconPath = resolve(ROOT, 'public/favicon.ico');
  writeFileSync(faviconPath, icoBuffer);
  console.log('✓ public/favicon.ico (16/32/48)');

  console.log('\nDone! All icons generated.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
