import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { uniwind } from 'uniwind/vite';
import { defineConfig, transformWithEsbuild, type Plugin } from 'vite';

// Витрина kit в браузере: те же компоненты, что в лаунчере, через react-native-web и Uniwind.
// Это и пример настройки Vite для веб-приложения на kit

// Пакеты @rn-primitives публикуют JSX в .js/.mjs — Rollup его не разбирает, переводим сами
const rnPrimitivesJsx = (): Plugin => ({
  name: 'rn-primitives-jsx',
  enforce: 'pre',
  async transform(code, id) {
    if (/@rn-primitives\/.+\.m?js$/.test(id)) {
      const out = await transformWithEsbuild(code, id, {
        loader: 'jsx',
        jsx: 'automatic',
      });
      // Карты исходников зависимостей витрине не нужны
      return { code: out.code, map: null };
    }
  },
});

export default defineConfig(({ mode }) => ({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [
    rnPrimitivesJsx(),
    tailwindcss(),
    uniwind({ cssEntryFile: './src/global.css' }),
    react(),
  ],
  resolve: {
    // Веб-версии модулей (dialog.web.js на Radix) раньше нативных
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.mjs',
      '.web.js',
      '.tsx',
      '.ts',
      '.mjs',
      '.js',
      '.json',
    ],
    alias: {
      // Портал с ключами вместо @rn-primitives/portal (README: «Портал»)
      '@rn-primitives/portal': fileURLToPath(
        new URL('../src/rnp-portal.tsx', import.meta.url),
      ),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx', '.mjs': 'jsx' },
      resolveExtensions: ['.web.mjs', '.web.js', '.mjs', '.js', '.json'],
    },
  },
  // Часть кода React Native ждёт глобальные __DEV__ и global, как в Metro
  define: {
    __DEV__: JSON.stringify(mode !== 'production'),
    global: 'globalThis',
  },
  build: { outDir: 'dist', emptyOutDir: true },
}));
