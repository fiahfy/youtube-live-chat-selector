import { crx, defineManifest } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import packageJson from './package.json'

const { description, version, productName } = packageJson

const manifest = defineManifest({
  name: productName,
  description,
  version,
  manifest_version: 3,
  icons: {
    128: 'icon.png',
  },
  background: {
    service_worker: 'src/background.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://www.youtube.com/live_chat*'],
      all_frames: true,
      js: ['src/content-script.ts'],
    },
  ],
  action: {
    default_icon: 'icon.png',
    default_popup: 'src/popup.html',
  },
  permissions: ['storage'],
  host_permissions: ['https://www.youtube.com/*'],
})

export default defineConfig({
  plugins: [react(), crx({ manifest }), tsconfigPaths()],
  server: { port: 9012, hmr: { port: 9012 } },
})
