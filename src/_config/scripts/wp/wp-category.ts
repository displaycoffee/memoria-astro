/* Scripts */
import { utils } from '../utils';
import { variables } from '../variables';

export const wpCategory = {
	format: (data: CategoryRawType | CategoriesRawType) => {
		// Format category data
		const formatData = (category: CategoryRawType) => {
			// Return formatted data
			return {
				content: category?.description ?? '',
				excerpt: category?.description ? utils.any.truncate(utils.any.stripHTML(category.description), 300) : '',
				id: `category-${category?.categoryId ?? 0}`,
				name: category?.name ?? '',
				slug: category?.slug ?? '',
				url: category?.uri ?? '',
			};
		};

		// If this is an array of categories, loop through categories
		if (Array.isArray(data)) {
			return data.map((category: CategoryRawType) => {
				return formatData(category);
			});
		} else {
			return formatData(data);
		}
	},
	fetch: {
		all: async () => {
			let allData: CategoriesType = [];
			let hasNextPage = true;
			let after: string | null = null;
			let page = 0;
			const maxPages = 100;

			// Loop through pages until all categories are fetched
			while (hasNextPage && page < maxPages) {
				page++;

				// Fetch category data
				const data = await utils.any.fetch({
					query: wpCategory.query('query-all'),
					url: variables.urls.graphQL,
					variables: { after },
				});

				// Format and set data
				if (data?.categories?.nodes) {
					allData = [...allData, ...(wpCategory.format(data.categories.nodes) as CategoriesType)];
				}

				// If there is a next page, keep going
				// Otherwise, end the loop
				hasNextPage = data?.categories?.pageInfo?.hasNextPage ?? false;
				after = data?.categories?.pageInfo?.endCursor ?? null;
			}

			return allData;
		},
	},
	query: (format: GraphQLQueryFormatType) => {
		// Shared query function for fetching category data
		const query = `
			categoryId
			description
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
			case 'query-all':
				return `query Categories($after: String) {
					categories(first: 100, after: $after) {
						pageInfo {
							hasNextPage
							endCursor
						}
						nodes {
							${query}
						}
					}
				}`;
			default:
				return query;
		}
	},
};
