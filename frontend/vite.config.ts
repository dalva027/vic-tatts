import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imageSlotDevPlugin } from './plugins/image-slot'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), imageSlotDevPlugin()],
  server: {
    port: 5173,
    open: true,
    watch: {
      // The dev image store writes into public/uploads; don't let those
      // writes trigger a full page reload mid-edit.
      ignored: ['**/public/uploads/**'],
    },
  },
})
