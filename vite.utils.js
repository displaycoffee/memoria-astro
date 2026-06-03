export const viteUtils = {
	assetFileNames: (file) => {
		if (file.name.includes('.css')) {
			return `assets/[ext]/styles.css`;
		} else {
			return `assets/[ext]/[name].[ext]`;
		}
	},
	chunkFileNames: (file) => {
		return `assets/js/bundle.${file.name.toLowerCase()}.js`;
	},
	entryFileNames: () => {
		return `assets/js/bundle.js`;
	},
};
