import {fileURLToPath} from 'url';

import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import symfonyPlugin from 'vite-plugin-symfony';


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        symfonyPlugin({
            viteDevServerHostname: 'localhost',
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('src/UI/', import.meta.url)),
            '@public': fileURLToPath(new URL('public', import.meta.url)),
        },
    },
    build: {
        assetsInlineLimit: 512,
        manifest: true,
        reportCompressedSize: true,
        emptyOutDir: true,
        rollupOptions: {
            input: {
                app: './src/UI/main.tsx',
            },
        }
    },
    server: {
        watch: {
            ignored: ['**/.idea/**', '**/tests/**', '**/var/**', '**/vendor/**'],
        }
    },
});
