export const wpTag = {
	format: (data?: TagRawType) => {
		// Format tag data
		const tagData: TagType = {
			id: `tag-${data?.tagId ?? 0}`,
			name: data?.name ?? '',
			slug: data?.slug ?? '',
			url: data?.uri ?? '',
		};

		return tagData;
	},
	query: (format: GraphQLQueryFormatType) => {
		// Shared query function for fetching tag data
		const query = `
			tagId
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
