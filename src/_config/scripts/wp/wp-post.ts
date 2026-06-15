/* Scripts */
import { utils } from '../utils';
import { variables } from '../variables';
import { wpAuthor } from './wp-author';
import { wpImage } from './wp-image';

/* Post settings */
const settings = {
	imageSize: 'LARGE',
	pageSize: 12,
};

/* Main post functions */
export const wpPost = {
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
				author: wpAuthor.format(post.author),
				content: post.content,
				date: utils.any.getDate(post.date),
				excerpt: utils.any.truncate(utils.any.stripHTML(post.excerpt), 300),
				id: post.postId,
				image: wpImage.format(`${post.title} - Featured Image`, true, post?.featuredImage),
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
	fetch: {
		post: async (uri: string) => {
			let postData: PostType | null = null;

			// Get post data
			const data = await utils.any.fetch({
				query: wpPost.query('query'),
				url: variables.urls.graphQL,
				variables: { uri },
			});

			// Format and set data
			if (data?.nodeByUri) {
				postData = wpPost.format(data.nodeByUri) as PostType;
			}

			return postData;
		},
		posts: async (pageSize: number) => {
			let postsData: PostsType = [];

			// Get posts data
			const data = await utils.any.fetch({
				query: wpPost.query('query-nodes', pageSize),
				url: variables.urls.graphQL,
			});

			// Format and set data
			if (data?.posts?.nodes) {
				postsData = wpPost.format(data.posts.nodes) as PostsType;
			}

			return postsData;
		},
	},
	query: (format: GraphQLQueryFormatType, pageSize?: number) => {
		// Shared query function for fetching post data
		const query = `
			author {
				${wpAuthor.query('node')}
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
				${wpImage.query('node', settings.imageSize)}
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
			case 'query':
				return `query Post($uri: String!) {
					nodeByUri(uri: $uri) {
						...on Post {
							${query}
						}
					}
				}`;
			case 'query-nodes':
				return `query Posts {
					posts(first: ${pageSize ?? settings.pageSize}) {
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
