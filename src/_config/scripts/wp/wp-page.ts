/* Scripts */
import { utils } from '../utils';
import { author } from './wp-author';
import { image } from './wp-image';

export const page = {
	format: (data: PageRawType | PagesRawType) => {
		// Format page data
		const formatData = (page: PageRawType) => {
			// Return formatted data
			return {
				author: author.format(page.author),
				content: page.content,
				date: utils.any.getDate(page.date),
				excerpt: utils.any.truncate(utils.any.stripHTML(page.content), 300),
				id: page.pageId,
				image: image.format(`${page.title} - Featured Image`, true, page?.featuredImage),
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
	query: (format: GraphQLQueryFormatType, imageSize: string) => {
		// Shared query function for fetching page data
		const query = `
			author {
				${author.query('node')}
			}
			content
			date
			featuredImage {
				${image.query(imageSize)}
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
			default:
				return query;
		}
	},
};
