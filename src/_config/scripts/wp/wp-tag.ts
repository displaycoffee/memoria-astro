/* Scripts */
import { utils } from '../utils';
import { variables } from '../variables';

/* Tag settings */
const settings = {
	pageSize: 12,
};

export const wpTag = {
	format: (data: TagRawType | TagsRawType) => {
		// Format tag data
		const formatData = (tag: TagRawType) => {
			// Return formatted data
			return {
				content: tag?.description ?? '',
				excerpt: tag?.description ? utils.any.truncate(utils.any.stripHTML(tag.description), 300) : '',
				id: `tag-${tag?.tagId ?? 0}`,
				name: tag?.name ?? '',
				slug: tag?.slug ?? '',
				url: tag?.uri ?? '',
			};
		};

		// If this is an array of tags, loop through tags
		if (Array.isArray(data)) {
			return data.map((tag: TagRawType) => {
				return formatData(tag);
			});
		} else {
			return formatData(data);
		}
	},
	fetch: {
		all: async () => {
			let allData: TagsType = [];
			let hasNextPage = true;
			let after: string | null = null;
			let page = 0;
			const maxPages = 100;

			// Loop through pages until all tags are fetched
			while (hasNextPage && page < maxPages) {
				page++;

				// Fetch tag data
				const data = await utils.any.fetch({
					query: wpTag.query('query-all'),
					url: variables.urls.graphQL,
					variables: { after },
				});

				// Format and set data
				if (data?.tags?.nodes) {
					allData = [...allData, ...(wpTag.format(data.tags.nodes) as TagsType)];
				}

				// If there is a next page, keep going
				// Otherwise, end the loop
				hasNextPage = data?.tags?.pageInfo?.hasNextPage ?? false;
				after = data?.tags?.pageInfo?.endCursor ?? null;
			}

			return allData;
		},
		tags: async (pageSize: number) => {
			let tagsData: TagsType = [];

			// Get tags data
			const data = await utils.any.fetch({
				query: wpTag.query('query-nodes', pageSize),
				url: variables.urls.graphQL,
			});

			// Format and set data
			if (data?.tags?.nodes) {
				tagsData = wpTag.format(data.tags.nodes) as TagsType;
			}

			return tagsData;
		},
	},
	query: (format: GraphQLQueryFormatType, pageSize?: number) => {
		// Shared query function for fetching tag data
		const query = `
			tagId
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
				return `query Tags($after: String) {
					tags(first: 100, after: $after) {
						pageInfo {
							hasNextPage
							endCursor
						}
						nodes {
							${query}
						}
					}
				}`;
			case 'query-nodes':
				return `query Tags {
					tags(first: ${pageSize ?? settings.pageSize}) {
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
