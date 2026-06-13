/* Scripts */
import { utils } from '../utils';
import { author } from './wp-author';
import { image } from './wp-image';

/* Post settings */
const settings = {
	imageSize: 'LARGE',
};

/* Main post functions */
export const post = {
	format: (data: PostRawType | PostsRawType) => {
		// Format post data
		const formatData = (post: PostRawType) => {
			// // Format categories and tags
			// const formatList = (values: ObjectPrimitiveType[], list: ObjectPrimitiveType[]) => {
			// 	values.forEach((value: ObjectPrimitiveType) => {
			// 		list.push({
			// 			id: value.categoryId || value.tagId,
			// 			name: value.name,
			// 			slug: value.slug,
			// 			url: value.uri,
			// 		});
			// 	});
			// };

			// // Create categories and tags
			// const categories: ObjectPrimitiveType[] = [];
			// const tags: ObjectPrimitiveType[] = [];

			// if (post?.categories?.nodes && post.categories.nodes.length !== 0) {
			// 	formatList(post.categories.nodes, categories);
			// }
			// if (post?.tags?.nodes && post.tags.nodes.length !== 0) {
			// 	formatList(post.tags.nodes, tags);
			// }

			// Return formatted data
			return {
				author: author.format(post.author),
				content: post.content,
				date: utils.any.getDate(post.date),
				excerpt: utils.any.truncate(utils.any.stripHTML(post.excerpt), 300),
				id: post.postId,
				image: image.format(`${post.title} - Featured Image`, true, post?.featuredImage),
				slug: post.slug,
				title: post.title,
				url: post.uri,
			};
		};

		// If this is an array of posts, loop through posts
		if (Array.isArray(data)) {
			return data.map((post: PostRawType) => {
				return formatData(post);
			});
		} else {
			return formatData(data);
		}
	},
	query: (format: GraphQLQueryFormatType) => {
		// Shared query function for fetching post data
		const query = `
			author {
				${author.query('node')}
			}
			categories {
				nodes {
					categoryId
					name
					slug
					uri
				}
			}
			content
			date
			excerpt(format: RENDERED)
			featuredImage {
				${image.query('node', settings.imageSize)}
			}
			postId
			slug
			tags {
				nodes {
					name
					slug
					tagId
					uri
				}
			}
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
