/* Packages */
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

/* Scripts */
import { viteUtils } from './vite.utils.js';
import packageJSON from './package.json' with { type: 'json' };

const hostname = packageJSON.homepage || 'https://localhost:3000';

export default defineConfig({
	site: hostname,
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
