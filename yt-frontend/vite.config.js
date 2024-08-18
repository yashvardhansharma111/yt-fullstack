import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Define the full Vite configuration
export default defineConfig({
  // Server configuration
  server: {
    proxy: {
      // Proxy all requests that start with /api to the backend server
      '/api': {
        target: 'http://localhost:3000', // Backend server URL
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, '') // Optionally remove /api prefix
      },
    },
  },

  // Plugins to be used
  plugins: [
    react(), // React plugin for Vite
  ],

  // CSS configuration
  css: {
    postcss: './postcss.config.js', // Points to the PostCSS configuration file
  },

  // Resolve configuration to set up path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias @ to point to ./src
    },
  },

  // Build configuration (if needed)
  build: {
    outDir: 'dist', // Output directory for production builds
    sourcemap: true, // Enable sourcemaps for easier debugging
  },

  // Additional options for flexibility and optimization
  optimizeDeps: {
    include: ['react', 'react-dom'], // Ensures proper optimization of key dependencies
  },
});
