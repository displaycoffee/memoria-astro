/* Scripts */
import { utils } from '../utils';
import { variables } from '../variables';
import { wpImage } from './wp-image';

/* Page settings */
const settings = {
	imageSize: 'LARGE',
	pageSize: 12,
};

/* Main page functions */
export const wpPage = {
	format: (data: PageRawType | PagesRawType) => {
		// Format page data
		const formatData = (page: PageRawType) => {
			// Return formatted data
			return {
				content: page.content,
				excerpt: utils.any.truncate(utils.any.stripHTML(page.content), 300),
				id: `page-${page.pageId}`,
				image: wpImage.format(`${page.title} - Featured Image`, true, page?.featuredImage),
				slug: page.slug,
				title: page.title,
				url: page.uri,
			};
		};

		// If this is an array of pages, loop through pages
		if (Array.isArray(data)) {
			return data.map((page: PageRawType) => {
				return formatData(page);
			});
		} else {
			return formatData(data);
		}
	},
	fetch: {
		all: async (exclude?: string[]) => {
			let allData: PagesType = [];
			let hasNextPage = true;
			let after: string | null = null;
			let page = 0;
			const maxPages = 100;

			// Loop through pages until all pages are fetched
			while (hasNextPage && page < maxPages) {
				page++;

				// Fetch page data
				const data = await utils.any.fetch({
					query: wpPage.query('query-all'),
					url: variables.urls.graphQL,
					variables: { after },
				});

				// Format and set data
				if (data?.pages?.nodes) {
					const formatted = wpPage.format(data.pages.nodes) as PagesType;
					const filtered = exclude?.length ? formatted.filter((page) => !exclude.includes(page.slug)) : formatted;
					allData = [...allData, ...filtered];
				}

				// If there is a next page, keep going
				// Otherwise, end the loop
				hasNextPage = data?.pages?.pageInfo?.hasNextPage ?? false;
				after = data?.pages?.pageInfo?.endCursor ?? null;
			}

			return allData;
		},
		page: async (uri: string) => {
			let pageData: PageType | null = null;

			// Fetch page data
			const data = await utils.any.fetch({
				query: wpPage.query('query'),
				url: variables.urls.graphQL,
				variables: { uri },
			});

			// Format and set data
			if (data?.nodeByUri) {
				pageData = wpPage.format(data.nodeByUri) as PageType;
			}

			return pageData;
		},
		pages: async (pageSize: number, exclude?: string[]) => {
			let pagesData: PagesType = [];

			// Get pages data
			const data = await utils.any.fetch({
				query: wpPage.query('query-nodes', pageSize),
				url: variables.urls.graphQL,
			});

			// Format and set data
			if (data?.pages?.nodes) {
				pagesData = wpPage.format(data.pages.nodes) as PagesType;
				pagesData = exclude?.length ? pagesData.filter((page) => !exclude.includes(page.slug)) : pagesData;
			}

			return pagesData;
		},
	},
	query: (format: GraphQLQueryFormatType, pageSize?: number) => {
		// Shared query function for fetching page data
		const query = `
			content
			featuredImage {
				${wpImage.query('node', settings.imageSize)}
			}
			pageId
			slug
			title
			uri
		`;

		// Return different query depending on format
		switch (format) {
			case 'node':
				return `node { ${query} }`;
			case 'nodes':
				return `nodes { ${query} }`;
			case 'query':
				return `query Page($uri: String!) {
					nodeByUri(uri: $uri) {
						...on Page {
							${query}
						}
					}
				}`;
			case 'query-all': {
				return `query Pages($after: String) {
					pages(first: 100, after: $after) {
						pageInfo {
							hasNextPage
							endCursor
						}
						nodes {
							${query}
						}
					}
				}`;
			}
			case 'query-nodes':
				return `query Pages {
					pages(first: ${pageSize ?? settings.pageSize}) {
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
