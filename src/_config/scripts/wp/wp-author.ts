/* Scripts */
import { utils } from '../utils';
import { variables } from '../variables';
import { wpImage } from './wp-image';

/* Author settings */
const settings = {
	pageSize: 12,
};

export const wpAuthor = {
	format: (data: AuthorRawType | AuthorsRawType | undefined) => {
		// Format author data
		const formatData = (author: AuthorRawType | undefined) => {
			const altText = author?.name ? `${author.name} - Avatar` : `Avatar`;

			// Return formatted data
			return {
				avatar: wpImage.format(altText, false, { sourceUrl: author?.avatar?.url }),
				content: author?.description ?? '',
				excerpt: author?.description ? utils.any.truncate(utils.any.stripHTML(author.description), 300) : '',
				id: `author-${author?.userId ?? 0}`,
				name: author?.name ?? '',
				slug: author?.slug ?? '',
				url: author?.slug ? `/authors/${author.slug}` : '',
			};
		};

		// If this is an array of authors, loop through authors
		if (Array.isArray(data)) {
			return data.map((author: AuthorRawType) => {
				return formatData(author);
			});
		} else {
			return formatData(data);
		}
	},
	fetch: {
		all: async () => {
			let allData: AuthorsType = [];
			let hasNextPage = true;
			let after: string | null = null;
			let page = 0;
			const maxPages = 100;

			// Loop through pages until all authors are fetched
			while (hasNextPage && page < maxPages) {
				page++;

				// Fetch author data
				const data = await utils.any.fetch({
					query: wpAuthor.query('query-all'),
					url: variables.urls.graphQL,
					variables: { after },
				});

				// Format and set data
				if (data?.users?.nodes) {
					allData = [...allData, ...(wpAuthor.format(data.users.nodes) as AuthorsType)];
				}

				// If there is a next page, keep going
				// Otherwise, end the loop
				hasNextPage = data?.users?.pageInfo?.hasNextPage ?? false;
				after = data?.users?.pageInfo?.endCursor ?? null;
			}

			return allData;
		},
		authors: async (pageSize: number) => {
			let authorsData: AuthorsType = [];

			// Get authors data
			const data = await utils.any.fetch({
				query: wpAuthor.query('query-nodes', pageSize),
				url: variables.urls.graphQL,
			});

			// Format and set data
			if (data?.users?.nodes) {
				authorsData = wpAuthor.format(data.users.nodes) as AuthorsType;
			}

			return authorsData;
		},
	},
	query: (format: GraphQLQueryFormatType, pageSize?: number) => {
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
			case 'query-all':
				return `query Authors($after: String) {
					users(first: 100, after: $after, where: { hasPublishedPosts: [POST] }) {
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
				return `query Authors {
					users(first: ${pageSize ?? settings.pageSize}, where: { hasPublishedPosts: [POST] }) {
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
