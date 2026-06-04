import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { viteUtils } from './vite.utils';

export default defineConfig({
	site: 'https://memoria.display.coffee',
	integrations: [react(), sitemap()],
	build: {
		assets: 'assets',
	},
	vite: {
		build: {
			rollupOptions: {
				output: {
					assetFileNames: (file) => {
						return viteUtils.assetFileNames(file);
					},
				},
			},
		},
		environments: {
			client: {
				build: {
					rollupOptions: {
						output: {
							chunkFileNames: (file) => {
								return viteUtils.chunkFileNames(file);
							},
							entryFileNames: () => {
								return viteUtils.entryFileNames();
							},
						},
					},
				},
			},
		},
	},
});
