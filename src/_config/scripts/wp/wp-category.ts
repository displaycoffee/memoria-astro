export const wpCategory = {
	format: (data?: CategoryRawType) => {
		// Format category data
		const categoryData: CategoryType = {
			id: `category-${data?.categoryId ?? 0}`,
			name: data?.name ?? '',
			slug: data?.slug ?? '',
			url: data?.uri ?? '',
		};

		return categoryData;
	},
	query: (format: GraphQLQueryFormatType) => {
		// Shared query function for fetching category data
		const query = `
			categoryId
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
