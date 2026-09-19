import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
const proxy = { '/api': { target: 'http://127.0.0.1:3005', rewrite: path => path.replace(/^\/api/, '') } };
export default defineConfig({ plugins: [vue()], server: { proxy }, preview: { proxy } });
