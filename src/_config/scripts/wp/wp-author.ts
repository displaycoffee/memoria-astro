/* Scripts */
import { image } from './wp-image';

export const author = {
	format: (data?: AuthorRawNodeType) => {
		const attrs = data?.node;
		const altText = attrs?.name ? `${attrs.name} - Avatar` : `Avatar`;

		// Format author data
		const authorData: AuthorType = {
			avatar: image.format(altText, false, { sourceUrl: attrs?.avatar?.url }),
			description: attrs?.description ?? '',
			id: attrs?.id ?? '',
			name: attrs?.name ?? '',
			slug: attrs?.slug ?? '',
			url: attrs?.uri ? attrs.uri : ``,
		};

		return authorData;
	},
	query: (format: GraphQLQueryFormatType) => {
		// Shared query function for fetching author data
		const query = `
			avatar {
				url
			}
			description
			id
			name
			slug
			uri
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
