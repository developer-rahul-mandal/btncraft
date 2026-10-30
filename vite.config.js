import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(rootDir, 'src/index.js'),
      name: 'BtnCraft',
      fileName: (format) => `btncraft.${format}.js`,
      formats: ['es', 'umd']
    },
    sourcemap: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'btncraft.css';
          }
          return assetInfo.name;
        },
        exports: 'named'
      }
    }
  }
});
