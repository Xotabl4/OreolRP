import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        host: '0.0.0.0', // Listen on all local IPs
        port: 5173 // Default port, can be overridden by scripts
    }
})
