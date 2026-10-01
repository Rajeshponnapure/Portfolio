import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default {
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|react-helmet-async|scheduler)\//.test(id)) return 'vendor-react'
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) return 'vendor-motion'
          return undefined
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames(assetInfo) {
          const name = assetInfo.names?.[0] ?? assetInfo.name ?? ''
          if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/.test(name)) return 'assets/images/[name]-[hash][extname]'
          if (/\.(woff2?|ttf|eot)$/.test(name)) return 'assets/fonts/[name]-[hash][extname]'
          if (/\.css$/.test(name)) return 'assets/css/[name]-[hash][extname]'
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  preview: { port: 4173 },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'zustand', 'lenis'],
  },
}
