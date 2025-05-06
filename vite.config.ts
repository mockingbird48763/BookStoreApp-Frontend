import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 配置環境變數
  const env = loadEnv(mode, process.cwd())
  const imageBase = env.VITE_IMAGE_BASE_URL
  console.log('👀 current mode:', mode)

  return {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5154',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
        '/images': {
          target: imageBase || 'http://localhost:5154',
          changeOrigin: true,
          rewrite: (path) => {
            if (imageBase) {
              // 如果設定了線上 URL，就去掉 /images
              return path.replace(/^\/images/, '')
            } else {
              // 如果沒有設定，代表是開發環境本地使用，就保留原路徑
              return path
            }
          },
        },
      },
    },
    plugins: [vue(), vueJsx(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
