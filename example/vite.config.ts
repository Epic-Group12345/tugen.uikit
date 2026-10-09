import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Витрина веб-слоя kit (@tugen/uikit/web): чистый Vite + React + Tailwind, как в веб-приложении.
// Особой настройки не нужно — пакеты kit и Radix собираются как обычные

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [tailwindcss(), react()],
  build: { outDir: 'dist', emptyOutDir: true },
});
