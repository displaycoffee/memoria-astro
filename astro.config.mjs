import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { viteUtils } from './vite.utils';
import node from '@astrojs/node';

export default defineConfig({
	site: 'https://memoria.display.coffee',
	adapter: node({
		mode: 'standalone',
		experimentalDisableStreaming: true, // Disables streaming globally for the Node server
	}),
	integrations: [
		react({
			experimentalDisableStreaming: true, // Disables streaming for React specifically
		}),
		sitemap(),
	],
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
