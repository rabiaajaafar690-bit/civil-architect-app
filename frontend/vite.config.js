import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Strip the `crossorigin` attribute that Vite injects into <script> and
// <link> tags.  Under Electron's file:// protocol the attribute prevents
// the browser from loading same-origin assets, resulting in a blank page.
function stripCrossOrigin() {
  return {
    name: 'strip-crossorigin',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(/ crossorigin/g, '')
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), stripCrossOrigin()],
  server: {
    proxy: {
      '/generate-plan': 'http://127.0.0.1:8000',
      '/ai': 'http://127.0.0.1:8000',
    },
  },
})
