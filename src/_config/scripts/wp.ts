/* Scripts */
import { utils } from './utils';
import { variables } from './variables';

/* Post functions for fetching data */
const post = {
	format: (data: PostRawType | PostsRawType) => {
		// Format post data
		const formatData = (post: PostRawType) => {
			// Truncate and strip HTML from excerpt
			const excerpt = utils.any.truncate(utils.any.stripHTML(post.excerpt), 300);

			// Create image properties
			const image = {
				alt: post?.featuredImage?.node?.altText ? post.featuredImage.node.altText : `${post.title} - Logo`,
				url: post?.featuredImage?.node?.sourceUrl ? post.featuredImage.node.sourceUrl : '/assets/images/theme/placeholder.jpg',
			};

			// Return formatted data
			return {
				author: post?.author?.node?.name ? post.author.node.name : 'Unknown',
				content: post.content,
				date: utils.any.getDate(post.date),
				excerpt: excerpt,
				id: post.postId,
				image: image,
				title: post.title,
				url: `/${post.slug}`,
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
	query: (hasNodes: boolean, imageSize: string) => {
		// Shared query function for fetching post data
		const query = `
			author {
				node {
					name
				}
			}
			content
			date
			excerpt(format: RENDERED)
			featuredImage {
				node {
					altText
					sourceUrl(size: ${imageSize})
				}
			}
			postId
			slug
			title
		`;

		return hasNodes ? `nodes { ${query} }` : query;
	},
};

/* Query functions for WordPress data */
export const wp = {
	menu: async (id: string) => {
		let menuData = {};

		// Get menu data
		const data = await utils.any.fetch({
			url: variables.urls.graphQL,
			query: `query Menu($id: ID!) {
				menu(id: $id, idType: NAME) {
					menuItems(first: 20, where: {parentId: 0}) {
						nodes {
							childItems(first: 20) {
								nodes {
									label
									id
									url
								}
							}
							label
							id
							url
						}
					}
				}
			}`,
			variables: { id },
		});

		// Format and set data
		if (data?.menu?.menuItems?.nodes) {
			menuData = data.menu.menuItems.nodes;
		}

		return menuData;
	},
	posts: async (amount: number) => {
		let postsData: PostsType = [];

		// Get posts data
		const data = await utils.any.fetch({
			url: variables.urls.graphQL,
			query: `query Posts {
				posts(first: ${amount}) {
					${post.query(true, 'LARGE')}
				}
			}`,
		});

		// Format and set data
		if (data?.posts?.nodes) {
			postsData = post.format(data.posts.nodes) as PostsType;
		}

		return postsData;
	},
	search: async (query: string, amount: number, url = variables.urls.graphQL) => {
		let searchData: PostsType = [];

		// Get posts data
		const data = await utils.any.fetch({
			url,
			query: `query Search($query: String) {
				posts(first: ${amount}, where: { search: $query }) {
					${post.query(true, 'LARGE')}
				}
			}`,
			variables: { query },
		});

		// Format and set data
		if (data?.posts?.nodes) {
			searchData = post.format(data.posts.nodes) as PostsType;
		}

		return searchData;
	},
	site: async () => {
		let siteData = {};

		// Get site details
		const data = await utils.any.fetch({
			url: variables.urls.graphQL,
			query: `query Settings {
				generalSettings {
					description
					siteIcon {
						node {
							altText
							sourceUrl(size: MEDIUM)
						}
					}
					title
					url
				}
			}`,
		});

		// Format and set data
		if (data?.generalSettings) {
			const generalSettings = data.generalSettings;
			siteData = {
				description: generalSettings?.description ? generalSettings.description : '',
				icon: {
					alt: generalSettings?.siteIcon?.node?.altText ? generalSettings.siteIcon.node.altText : `${generalSettings.title} - Logo`,
					url: generalSettings?.siteIcon?.node?.sourceUrl ? generalSettings.siteIcon.node.sourceUrl : '',
				},
				title: generalSettings.title,
				url: variables.urls.site,
			};
		}

		return siteData;
	},
};
