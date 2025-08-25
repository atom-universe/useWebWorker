import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { workerImportPlugin } from '@atom-universe/worker-import';

export default defineConfig({
  plugins: [
    react(),
    workerImportPlugin({
      enableESModules: true,
    }),
  ],
});
