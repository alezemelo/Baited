import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const mockApiTarget =
    env.VITE_MOCK_API_TARGET || 'http://127.0.0.1:3001'
  const proxy = {
    '/api': {
      changeOrigin: true,
      target: mockApiTarget,
    },
  }

  return {
    plugins: [react(), tailwindcss()],
    preview: { proxy },
    server: { proxy },
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['src/**/*.test.{ts,tsx}'],
      setupFiles: ['./src/test/setup.ts'],
    },
  }
})
