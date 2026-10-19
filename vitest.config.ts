import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	test: {
		alias: {
			'~': path.resolve(import.meta.dirname, './src'),
		},
		environment: 'happy-dom',
		exclude: ['**/node_modules/**', '**/e2e/**'],
		globals: true,
	},
});
