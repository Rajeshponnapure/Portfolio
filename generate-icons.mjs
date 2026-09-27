import { createRequire } from 'module';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = resolve('public/icons/icon.svg');
const outputDir = resolve('public/icons');

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  for (const size of sizes) {
    const outputPath = resolve(outputDir, `icon-${size}x${size}.png`);
    await sharp(inputSvg)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated ${size}x${size} icon`);
  }
  console.log('All icons generated!');
}

generateIcons().catch(console.error);