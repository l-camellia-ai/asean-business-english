import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), svgr({
      svgrOptions: {
        icon: true, exportType: 'named', namedExport: 'ReactComponent',
      },
    })],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/.pnpm/react@') || id.includes('node_modules/.pnpm/react-dom@') || id.includes('node_modules/.pnpm/react-router')) {
              return 'vendor';
            }
            if (id.includes('node_modules/.pnpm/@supabase')) {
              return 'supabase';
            }
            if (id.includes('node_modules/.pnpm/recharts')) {
              return 'charts';
            }
          },
        },
      },
    },
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port: 4173,
      host: true,
    },
  };
});
