export const wpImage = {
	format: (alt: string, placeholder: boolean, data?: ImageRawType | ImageRawNodeType) => {
		const attrs = data && 'node' in data ? data.node : data;
		const placeholderUrl = placeholder ? '/assets/images/theme/placeholder.jpg' : '';

		// Format image data
		const imageData: ImageType = {
			alt: attrs?.altText ? `${attrs.altText} - ${alt}` : alt,
			url: attrs?.sourceUrl ?? placeholderUrl,
		};

		return imageData;
	},
	query: (format: GraphQLQueryFormatType, imageSize: string) => {
		// Shared query function for fetching image data
		const query = `
			altText
			sourceUrl(size: ${imageSize})
		`;

		// Return different query depending on format
		switch (format) {
			case 'node':
				return `node { ${query} }`;
			case 'nodes':
				return `nodes { ${query} }`;
			default:
				return query;
		}
	},
};
