import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default {
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: function (id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('react-helmet')) return 'vendor-react'
            if (id.includes('framer-motion')) return 'vendor-motion'
            if (id.includes('three') || id.includes('@react-three')) return 'vendor-three'
            if (id.includes('zustand') || id.includes('lenis') || id.includes('gsap')) return 'vendor-utils'
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: function (assetInfo) {
          var info = assetInfo.name.split('.')
          var ext = info[info.length - 1]
          if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/.test(assetInfo.name)) return 'assets/images/[name]-[hash].' + ext
          if (/\.(woff2?|ttf|eot)$/.test(assetInfo.name)) return 'assets/fonts/[name]-[hash].' + ext
          if (/\.css$/.test(assetInfo.name)) return 'assets/css/[name]-[hash].' + ext
          return 'assets/[name]-[hash].' + ext
        },
      },
    },
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  preview: {
    port: 4173,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'zustand', 'lenis', 'gsap'],
  },
  esbuild: {
    legalComments: 'none',
    treeShaking: true,
    pure: ['console.log', 'console.debug'],
  },
},
}