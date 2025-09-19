import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // add this

export default defineConfig({
  // ensure asset URLs in your built HTML point to the root
  base: '/', 

  // align Vite's output directory with Vercel's distDir
  build: {
    outDir: 'dist',
    // if you need a custom folder for hashed assets, you can uncomment:
    // assetsDir: 'assets'
  },

  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // this makes @ point to /src
    },
  },
});
