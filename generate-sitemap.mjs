import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://rajeshponnapure.dev'
const PAGES = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/projects', changefreq: 'weekly', priority: 0.9 },
  { url: '/arsenal', changefreq: 'monthly', priority: 0.7 },
  { url: '/journey', changefreq: 'monthly', priority: 0.6 },
  { url: '/connect', changefreq: 'monthly', priority: 0.8 },
]

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${PAGES.map(page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${page.url}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${page.url}"/>
  </url>`).join('\n')}
</urlset>`

  const outputPath = path.join('dist', 'sitemap.xml')
  fs.writeFileSync(outputPath, sitemap)
  console.log(`✅ Sitemap generated at ${outputPath}`)
}

generateSitemap()