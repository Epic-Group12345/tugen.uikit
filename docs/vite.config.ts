import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { propsPlugin } from './props-plugin';

// Документация kit: такой же сайт на Vite + React + Tailwind, как веб-сервисы, на веб-слое kit.
// Примеры импортируют '@tugen/uikit/web' — как в приложении; здесь имя ведёт в исходники пакета

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  root: here('.'),
  // Относительные пути: сайт открывается с любого адреса (GitHub Pages, папка на сервере)
  base: './',
  plugins: [tailwindcss(), react(), propsPlugin()],
  resolve: {
    alias: {
      '@tugen/uikit/web': here('../src/web/index.ts'),
      '@tugen/uikit/tokens': here('../src/tokens.ts'),
    },
  },
  // Один бандл: на сайте все примеры сразу, а делить его на куски ради документации незачем
  build: { outDir: 'dist', emptyOutDir: true, chunkSizeWarningLimit: 2000 },
});
