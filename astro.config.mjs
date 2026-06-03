// @ts-check
import { defineConfig } from 'astro/config';
import { viteUtils } from './vite.utils';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
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
