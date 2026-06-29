import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Honour a harness/CI-assigned port (e.g. preview tooling) when present.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    strictPort: false,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Keep the admin/editor heavy deps out of the public critical path.
        // Function form (object form is rejected by newer Vite/Rolldown).
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined;
          // Scoped editor/db packages first — their paths also contain "/react/"
          // (e.g. @tiptap/react), so they must be matched before the react rule.
          if (id.includes('@tiptap') || id.includes('prosemirror')) {
            return 'tiptap';
          }
          if (id.includes('@supabase')) {
            return 'supabase';
          }
          if (
            id.includes('react-router') ||
            id.includes('/react-dom/') ||
            id.includes('/react/') ||
            id.includes('/scheduler/')
          ) {
            return 'react';
          }
          return 'vendor';
        },
      },
    },
  },
});
