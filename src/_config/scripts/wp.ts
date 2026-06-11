/* Scripts */
import { utils } from './utils';
import { variables } from './variables';

/* Function to format image */
const formatImage = (alt: string, placeholder: boolean, image?: { altText?: string; sourceUrl?: string }) => {
	const altData = image?.altText ? `${image.altText} - ${alt}` : alt;
	const imageData = image?.sourceUrl ? image.sourceUrl : placeholder ? '/assets/images/theme/placeholder.jpg' : '';

	// Return image data with formatted alt text and url
	return {
		alt: altData,
		url: imageData,
	};
};

/* Post functions for fetching and formatting data */
const post = {
	format: (data: PostRawType | PostsRawType) => {
		// Format post data
		const formatData = (post: PostRawType) => {
			// Truncate and strip HTML from excerpt
			const excerpt = utils.any.truncate(utils.any.stripHTML(post.excerpt), 300);

			// Create image properties
			const image = formatImage(`${post.title} - Featured Image`, true, post?.featuredImage?.node);

			// Return formatted data
			return {
				author: post?.author?.node?.name ?? 'Unknown',
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
export const wp: WPType = {
	menu: async (id: string) => {
		let menuData: MenuType[] = [];

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

		// Function to format menu items
		const formatMenu = (node: MenuRawType) => {
			return {
				id: node.id,
				label: node.label,
				url: node.url.replace(variables.urls.wp, ''),
			};
		};

		// Format and set data
		if (data?.menu?.menuItems?.nodes) {
			menuData = data.menu.menuItems.nodes.map((node: MenuRawType) => {
				// Format main menu item
				const menu: MenuType = {
					children: [],
					...formatMenu(node),
				};

				// Then format children
				if (node?.childItems?.nodes && node.childItems.nodes.length !== 0) {
					menu.children = node.childItems.nodes.map((child) => {
						return formatMenu(child);
					});
				}

				return menu;
			});
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
		let siteData: SiteType = { description: '', title: '', url: '' };

		// Get site details
		const data = await utils.any.fetch({
			url: variables.urls.graphQL,
			query: `query Settings {
				generalSettings {
					description
					title
					url
				}
			}`,
		});

		// Format and set data
		if (data?.generalSettings) {
			const generalSettings = data.generalSettings;
			siteData = {
				description: generalSettings?.description ?? '',
				title: generalSettings.title,
				url: variables.urls.site,
			};
		}

		return siteData;
	},
	themeOptions: async () => {
		let themeOptionsData: ThemeOptionsType = {
			social: [],
			sidebar: { slug: '' },
			header: { logo: { alt: '', url: '' } },
			footer: { blocks: [] },
		};

		// Get theme options
		const data = await utils.any.fetch({
			url: variables.urls.graphQL,
			query: `query ThemeOptions {
				themeOptions {
					socialFacebook
					socialInstagram
					socialTwitter
					socialGithub
					sidebarSlug
					headerLogo {
						altText
						sourceUrl(size: MEDIUM)
					}
					footerBlock01Order
					footerBlock01Content
					footerBlock02Order
					footerBlock02Content
					footerBlock03Order
					footerBlock03Content
				}
			}`,
		});

		// Format and set data
		if (data?.themeOptions) {
			const themeOptions = data.themeOptions;

			// Build social links
			const links = [];

			if (themeOptions?.socialFacebook) {
				links.push({
					label: 'Facebook',
					url: themeOptions.socialFacebook,
				});
			}
			if (themeOptions?.socialInstagram) {
				links.push({
					label: 'Instagram',
					url: themeOptions.socialInstagram,
				});
			}
			if (themeOptions?.socialTwitter) {
				links.push({
					label: 'Twitter / X',
					url: themeOptions.socialTwitter,
				});
			}
			if (themeOptions?.socialGithub) {
				links.push({
					label: 'GitHub',
					url: themeOptions.socialGithub,
				});
			}

			// Build footer blocks
			const blocks = [];

			if (themeOptions?.footerBlock01Order && themeOptions?.footerBlock01Content) {
				blocks.push({
					order: parseInt(themeOptions.footerBlock01Order),
					content: themeOptions.footerBlock01Content,
				});
			}
			if (themeOptions?.footerBlock02Order && themeOptions?.footerBlock02Content) {
				blocks.push({
					order: parseInt(themeOptions.footerBlock02Order),
					content: themeOptions.footerBlock02Content,
				});
			}
			if (themeOptions?.footerBlock03Order && themeOptions?.footerBlock03Content) {
				blocks.push({
					order: parseInt(themeOptions.footerBlock03Order),
					content: themeOptions.footerBlock03Content,
				});
			}

			// Re-sort footer blocks
			blocks.sort((a, b) => a.order - b.order);

			themeOptionsData = {
				social: links,
				sidebar: {
					slug: themeOptions?.sidebarSlug || '',
				},
				header: {
					logo: formatImage(`Header Logo`, false, themeOptions?.headerLogo),
				},
				footer: {
					blocks: blocks,
				},
			};
		}

		return themeOptionsData;
	},
};
