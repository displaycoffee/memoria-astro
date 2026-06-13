export const image = {
	format: (alt: string, placeholder: boolean, data?: ImageRawAttributesType | ImageRawType) => {
		const attrs = data && 'node' in data ? data.node : data;
		const placeholderUrl = placeholder ? '/assets/images/theme/placeholder.jpg' : '';

		// Format image data
		const imageData: ImageType = {
			alt: attrs?.altText ? `${attrs.altText} - ${alt}` : alt,
			url: attrs?.sourceUrl ?? placeholderUrl,
		};

		return imageData;
	},
	query: (imageSize: string) => {
		// Shared query function for fetching image data
		const query = `
			node {
				altText
				sourceUrl(size: ${imageSize})
			}
		`;

		return query;
	},
};
