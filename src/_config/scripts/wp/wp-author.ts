/* Scripts */
import { wpImage } from './wp-image';

export const wpAuthor = {
	format: (data?: AuthorRawNodeType) => {
		const attrs = data?.node;
		const altText = attrs?.name ? `${attrs.name} - Avatar` : `Avatar`;

		// Format author data
		const authorData: AuthorType = {
			avatar: wpImage.format(altText, false, { sourceUrl: attrs?.avatar?.url }),
			description: attrs?.description ?? '',
			id: `author-${attrs?.userId ?? 0}`,
			name: attrs?.name ?? '',
			slug: attrs?.slug ?? '',
			url: attrs?.uri ?? '',
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
			name
			slug
			uri
			userId
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
