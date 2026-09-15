export const viteUtils = {
	assetFileNames: (file) => {
		if (file.name.includes('.css')) {
			const stem = file.name == 'index.css' ? `` : `.${file.name.toLowerCase().replace(/\.css$/, '')}`;
			return `assets/[ext]/styles${stem}.[hash].css`;
		} else {
			return `assets/[ext]/[name].[hash].[ext]`;
		}
	},
	chunkFileNames: (file) => {
		return `assets/js/bundle.${file.name.toLowerCase()}.[hash].js`;
	},
	entryFileNames: () => {
		return `assets/js/bundle.[hash].js`;
	},
};
