import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
import type { UserConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDevelopment = process.env.NODE_ENV !== "production";
const isReplit = process.env.REPL_ID !== undefined;

// Chunk grouping function
function createManualChunks(id: string) {
  // React vendor chunk
  if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
    return 'react-vendor';
  }

  // Radix UI vendor chunk
  if (id.includes('node_modules/@radix-ui/')) {
    return 'ui-vendor';
  }

  // Monaco editor chunk
  if (id.includes('node_modules/@monaco-editor/')) {
    return 'monaco-editor';
  }

  return null;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    // Development-only plugins
    ...(isDevelopment && isReplit
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  // Build options
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    // Enable minification optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: !isDevelopment,
        drop_debugger: !isDevelopment,
      },
    },
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: createManualChunks,
      },
    },
    // Enable source maps in development
    sourcemap: isDevelopment,
    // Optimize asset handling
    assetsInlineLimit: 4096,
    // Improve chunk loading
    chunkSizeWarningLimit: 1000,
  },
  // Development server options
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  // Dependency optimization options
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-switch',
      '@monaco-editor/react',
    ],
    exclude: ['@replit/vite-plugin-cartographer'],
  },
  // ESBuild options for faster builds
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    target: ['esnext'],
  },
  // CSS processing options
  css: {
    devSourcemap: isDevelopment,
    modules: {
      localsConvention: 'camelCase',
    },
  },
  // Preview server options
  preview: {
    port: 3000,
    strictPort: true,
    cors: true,
  },
} as UserConfig);
