import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  // test 環境
  // command 可以是 serve 或 build
  // serve 是開發環境，build 是生產環境
  viteConfig({ mode: 'test', command: 'serve' }), // 加上 command: 'serve'
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)
