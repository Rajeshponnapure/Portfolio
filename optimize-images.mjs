import { createRequire } from 'module';
import { writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, join, extname, basename } from 'path';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const inputDirs = [
  'public/portraits',
  'public/projects',
];

const outputDir = 'public/optimized';
const quality = 80;

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

async function convertImage(inputPath, relativePath) {
  const name = basename(inputPath, extname(inputPath));
  const outDir = join(outputDir, relativePath);
  
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  try {
    // WebP
    await sharp(inputPath)
      .webp({ quality, effort: 6 })
      .toFile(join(outDir, `${name}.webp`));
    
    // AVIF
    await sharp(inputPath)
      .avif({ quality: quality - 10, effort: 6 })
      .toFile(join(outDir, `${name}.avif`));
    
    // Optimized original (if PNG/JPG)
    const ext = extname(inputPath).toLowerCase();
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      await sharp(inputPath)
        [ext === '.png' ? 'png' : 'jpeg']({ quality: 85 })
        .toFile(join(outDir, `${name}.optimized${ext}`));
    }

    console.log(`✅ Converted: ${relativePath}/${name}`);
  } catch (err) {
    console.error(`❌ Failed: ${inputPath}`, err.message);
  }
}

async function processDirectory(dir) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (['.png', '.jpg', '.jpeg', '.webp'].includes(extname(file).toLowerCase())) {
      const relativePath = dir.replace('public/', '');
      await convertImage(fullPath, relativePath);
    }
  }
}

async function main() {
  console.log('🔄 Starting image optimization...');
  
  for (const dir of inputDirs) {
    if (existsSync(dir)) {
      await processDirectory(dir);
    }
  }
  
  console.log('✅ Image optimization complete!');
}

main().catch(console.error);