/* Scripts */
import { utils } from '../utils';
import { variables } from '../variables';
import { wpAuthor } from './wp-author';
import { wpCategory } from './wp-category';
import { wpImage } from './wp-image';
import { wpTag } from './wp-tag';

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
			// Create categories and tags
			const categories: CategoriesType = [];
			const tags: TagsType = [];

			if (post?.categories?.nodes && post.categories.nodes.length !== 0) {
				post.categories.nodes.forEach((node: CategoryRawType) => {
					categories.push(wpCategory.format(node) as CategoryType);
				});
			}
			if (post?.tags?.nodes && post.tags.nodes.length !== 0) {
				post.tags.nodes.forEach((node: TagRawType) => {
					tags.push(wpTag.format(node) as TagType);
				});
			}

			// Return formatted data
			return {
				author: wpAuthor.format(post.author?.node) as AuthorType,
				categories: categories,
				content: post.content,
				date: utils.any.getDate(post.date),
				excerpt: utils.any.truncate(utils.any.stripHTML(post.excerpt), 300),
				hideSidebar: post?.hideSidebar ?? false,
				id: `post-${post.postId}`,
				image: wpImage.format(`${post.title} - Featured Image`, true, post?.featuredImage),
				slug: post.slug,
				tags: tags,
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
		all: async () => {
			let allData: PostsType = [];
			let hasNextPage = true;
			let after: string | null = null;
			let page = 0;
			const maxPages = 100;

			// Loop through pages until all posts are fetched
			while (hasNextPage && page < maxPages) {
				page++;

				// Fetch post data
				const data = await utils.any.fetch({
					query: wpPost.query('query-all'),
					url: variables.urls.graphQL,
					variables: { after },
				});

				// Format and set data
				if (data?.posts?.nodes) {
					allData = [...allData, ...(wpPost.format(data.posts.nodes) as PostsType)];
				}

				// If there is a next page, keep going
				// Otherwise, end the loop
				hasNextPage = data?.posts?.pageInfo?.hasNextPage ?? false;
				after = data?.posts?.pageInfo?.endCursor ?? null;
			}

			return allData;
		},
		author: async (slug: string, pageSize: number) => {
			let authorData: PostsType = [];

			// Get posts data
			const data = await utils.any.fetch({
				query: wpPost.query('query-author', pageSize),
				url: variables.urls.graphQL,
				variables: { slug },
			});

			if (data?.posts?.nodes) {
				authorData = wpPost.format(data.posts.nodes) as PostsType;
			}

			// Format and set data
			return authorData;
		},
		category: async (slug: string, pageSize: number) => {
			let categoryData: PostsType = [];

			// Get posts data
			const data = await utils.any.fetch({
				query: wpPost.query('query-category', pageSize),
				url: variables.urls.graphQL,
				variables: { slug },
			});

			// Format and set data
			if (data?.posts?.nodes) {
				categoryData = wpPost.format(data.posts.nodes) as PostsType;
			}

			return categoryData;
		},
		post: async (uri: string) => {
			let postData: PostType | null = null;

			// Fetch post data
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
		search: async (query: string, pageSize: number, url = variables.urls.graphQL) => {
			let searchData: PostsType = [];

			// Get posts data
			const data = await utils.any.fetch({
				query: wpPost.query('query-search', pageSize),
				url,
				variables: { query },
			});

			// Format and set data
			if (data?.posts?.nodes) {
				searchData = wpPost.format(data.posts.nodes) as PostsType;
			}

			return searchData;
		},
		tag: async (slug: string, pageSize: number) => {
			let tagData: PostsType = [];

			// Get posts data
			const data = await utils.any.fetch({
				query: wpPost.query('query-tag', pageSize),
				url: variables.urls.graphQL,
				variables: { slug },
			});

			// Format and set data
			if (data?.posts?.nodes) {
				tagData = wpPost.format(data.posts.nodes) as PostsType;
			}

			return tagData;
		},
	},
	query: (format: GraphQLQueryFormatType, pageSize?: number) => {
		// Shared query function for fetching post data
		const query = `
			author {
				${wpAuthor.query('node')}
			}
			categories {
				${wpCategory.query('nodes')}
			}
			content
			date
			excerpt(format: RENDERED)
			featuredImage {
				${wpImage.query('node', settings.imageSize)}
			}
			hideSidebar
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
			case 'query-all':
				return `query Posts($after: String) {
					posts(first: 100, after: $after) {
						pageInfo {
							hasNextPage
							endCursor
						}
						nodes {
							${query}
						}
					}
				}`;
			case 'query-author':
				return `query Posts($slug: String) {
					posts(first: ${pageSize ?? settings.pageSize}, where: { authorName: $slug }) {
						nodes {
							${query}
						}
					}
				}`;
			case 'query-category':
				return `query Posts($slug: String) {
					posts(first: ${pageSize ?? settings.pageSize}, where: { categoryName: $slug }) {
						nodes {
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
			case 'query-search':
				return `query Search($query: String) {
					posts(first: ${pageSize}, where: { search: $query }) {
						nodes { 
							${query}
						}
					}
				}`;
			case 'query-tag':
				return `query Posts($slug: String) {
					posts(first: ${pageSize ?? settings.pageSize}, where: { tag: $slug }) {
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
