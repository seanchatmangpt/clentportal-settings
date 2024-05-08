import vueI18n from '@intlify/vite-plugin-vue-i18n'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
const isProduction = process.env.NODE_ENV === 'production'
// https://vitejs.dev/config/
export default defineConfig({
  base: isProduction
    ? 'https://preview-internal.clientclub.net/'
    : 'https://staging.preview-internal.clientclub.net/',
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        app: process.env.VITE_ENTRY || 'index.html', // default
      },
      manualChunks: {
        '@gohighlevel/ghl-ui': ['@gohighlevel/ghl-ui'],
        '@gohighlevel/clientportal-core': ['@gohighlevel/clientportal-core'],
        lodash: ['lodash'],
        yup: ['yup'],
      },
    },
    minify: true,
  },
  plugins: [
    vue(),
    vueI18n({
      include: resolve(__dirname, './src/locales/**'),
    }),
  ],
  server: {
    port: 3040,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '/src'),
    },
  },
})
