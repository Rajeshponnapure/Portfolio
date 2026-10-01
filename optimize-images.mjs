// Generates responsive AVIF + WebP variants from assets-src/ into public/img/.
// Run: node optimize-images.mjs
import sharp from 'sharp'
import { mkdirSync, readdirSync } from 'node:fs'
import { join, parse } from 'node:path'

const jobs = [
  { dir: 'projects', widths: [480, 800] },
  { dir: 'portraits', widths: [420, 840] },
]

for (const { dir, widths } of jobs) {
  const out = join('public/img', dir)
  mkdirSync(out, { recursive: true })
  for (const file of readdirSync(join('assets-src', dir))) {
    const { name } = parse(file)
    for (const w of widths) {
      const img = () => sharp(join('assets-src', dir, file)).resize({ width: w, withoutEnlargement: true })
      await img().webp({ quality: 78, effort: 5 }).toFile(join(out, `${name}-${w}.webp`))
      await img().avif({ quality: 55, effort: 4 }).toFile(join(out, `${name}-${w}.avif`))
    }
    console.log('ok', dir, name)
  }
}
