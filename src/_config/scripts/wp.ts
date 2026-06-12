/* Scripts */
import { utils } from './utils';
import { variables } from './variables';

/* Image functions for fetching and formatting data */
const image = {
	format: (alt: string, placeholder: boolean, data?: ImageRawAttributesType | ImageRawType) => {
		const attrs = data && 'node' in data ? data.node : data;
		const placeholderUrl = placeholder ? '/assets/images/theme/placeholder.jpg' : '';

		// Format image data
		const imageData: ImageType = {
			alt: attrs?.altText ? `${attrs.altText} - ${alt}` : alt,
			url: attrs?.sourceUrl ?? placeholderUrl,
		};

		return imageData;
	},
	query: (imageSize: string) => {
		// Shared query function for fetching image data
		const query = `
			node {
				altText
				sourceUrl(size: ${imageSize})
			}
		`;

		return query;
	},
};

/* Author functions for fetching and formatting data */
const author = {
	format: (data?: AuthorRawType) => {
		const attrs = data?.node;
		const altText = attrs?.name ? `${attrs.name} - Avatar` : `Avatar`;

		// Format author data
		const authorData: AuthorType = {
			id: attrs?.id ?? '',
			name: attrs?.name ?? '',
			description: attrs?.description ?? '',
			slug: attrs?.slug ?? '',
			url: attrs?.slug ? `/${attrs.slug}` : ``,
			avatar: image.format(altText, false, { sourceUrl: attrs?.avatar?.url }),
		};

		return authorData;
	},
	query: () => {
		// Shared query function for fetching author data
		const query = `
			node {
				id
				name
				description
				slug
				avatar {
					url
				}
			}
		`;

		return query;
	},
};

/* Page functions for fetching and formatting data */
const page = {
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
				title: page.title,
				slug: page.slug,
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
	query: (hasNodes: boolean, imageSize: string) => {
		// Shared query function for fetching page data
		const query = `
			author {
				${author.query()}
			}
			content
			date
			featuredImage {
				${image.query(imageSize)}
			}
			pageId
			slug
			uri
			title
		`;

		return hasNodes ? `nodes { ${query} }` : query;
	},
};

/* Post functions for fetching and formatting data */
const post = {
	format: (data: PostRawType | PostsRawType) => {
		// Format post data
		const formatData = (post: PostRawType) => {
			// Return formatted data
			return {
				author: author.format(post.author),
				content: post.content,
				date: utils.any.getDate(post.date),
				excerpt: utils.any.truncate(utils.any.stripHTML(post.excerpt), 300),
				id: post.postId,
				image: image.format(`${post.title} - Featured Image`, true, post?.featuredImage),
				title: post.title,
				slug: post.slug,
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
	query: (hasNodes: boolean, imageSize: string) => {
		// Shared query function for fetching post data
		const query = `
			author {
				${author.query()}
			}
			content
			date
			excerpt(format: RENDERED)
			featuredImage {
				${image.query(imageSize)}
			}
			postId
			slug
			uri
			title
		`;

		return hasNodes ? `nodes { ${query} }` : query;
	},
};

/* Query functions for WordPress data */
export const wp: WPType = {
	menu: async (id: string) => {
		let menuData: MenuType[] = [];
		const urlAttrs = `
			label
			id
			url
		`;

		// Get menu data
		const data = await utils.any.fetch({
			url: variables.urls.graphQL,
			query: `query Menu($id: ID!) {
				menu(id: $id, idType: NAME) {
					menuItems(first: 20, where: {parentId: 0}) {
						nodes {
							${urlAttrs}
							childItems(first: 20) {
								nodes {
									${urlAttrs}
								}
							}
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
	page: async (uri: string) => {
		let pageData: PageType | null = null;

		// Get page data
		const data = await utils.any.fetch({
			url: variables.urls.graphQL,
			query: `query Page($uri: String!) {
				nodeByUri(uri: $uri) {
					...on Page {
						${page.query(false, 'LARGE')}
					}
				}
			}`,
			variables: { uri },
		});

		// Format and set data
		if (data?.nodeByUri) {
			pageData = page.format(data.nodeByUri) as PageType;
		}

		return pageData;
	},
	post: async (uri: string) => {
		let postData: PostType | null = null;

		// Get post data
		const data = await utils.any.fetch({
			url: variables.urls.graphQL,
			query: `query Post($uri: String!) {
				nodeByUri(uri: $uri) {
					...on Post {
						${post.query(false, 'LARGE')}
					}
				}
			}`,
			variables: { uri },
		});

		// Format and set data
		if (data?.nodeByUri) {
			postData = post.format(data.nodeByUri) as PostType;
		}

		return postData;
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
		let siteData: SiteType = {
			description: '',
			title: '',
			url: '',
		};

		// Get site details
		const data = await utils.any.fetch({
			url: variables.urls.graphQL,
			query: `query Settings {
				generalSettings {
					description
					title
				}
			}`,
		});

		// Format and set data
		if (data?.generalSettings) {
			const generalSettings: SiteRawType = data.generalSettings;

			siteData = {
				description: generalSettings?.description ?? '',
				title: generalSettings.title,
				url: variables.urls.site,
			};
		}

		return siteData;
	},
	themeOptions: async () => {
		const themeOptionsData: ThemeOptionsType = {
			social: [],
			sidebar: {
				slug: '',
			},
			header: {
				logo: { alt: '', url: '' },
			},
			footer: {
				blocks: [],
			},
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
			const themeOptions: ThemeOptionsRawType = data.themeOptions;

			// Build social links
			const buildLink = (id: string, label: string, url: string) => {
				themeOptionsData.social.push({ id, label, url });
			};
			if (themeOptions?.socialFacebook) {
				buildLink('facebook', 'Facebook', themeOptions.socialFacebook);
			}
			if (themeOptions?.socialInstagram) {
				buildLink('instagram', 'Instagram', themeOptions.socialInstagram);
			}
			if (themeOptions?.socialTwitter) {
				buildLink('twitter', 'Twitter / X', themeOptions.socialTwitter);
			}
			if (themeOptions?.socialGithub) {
				buildLink('github', 'GitHub', themeOptions.socialGithub);
			}

			// Add sidebar slug
			if (themeOptions?.sidebarSlug) {
				themeOptionsData.sidebar.slug = themeOptions.sidebarSlug;
			}

			// Add header logo
			if (themeOptions?.headerLogo) {
				themeOptionsData.header.logo = image.format(`Header Logo`, false, themeOptions.headerLogo);
			}

			// Build footer blocks
			const buildBlock = (id: string, order: string, content: string) => {
				themeOptionsData.footer.blocks.push({
					id: `footer-block-${id}`,
					order: parseInt(order),
					content,
				});
			};
			if (themeOptions?.footerBlock01Order && themeOptions?.footerBlock01Content) {
				buildBlock('01', themeOptions.footerBlock01Order, themeOptions.footerBlock01Content);
			}
			if (themeOptions?.footerBlock02Order && themeOptions?.footerBlock02Content) {
				buildBlock('02', themeOptions.footerBlock02Order, themeOptions.footerBlock02Content);
			}
			if (themeOptions?.footerBlock03Order && themeOptions?.footerBlock03Content) {
				buildBlock('03', themeOptions.footerBlock03Order, themeOptions.footerBlock03Content);
			}

			// Re-sort footer blocks
			themeOptionsData.footer.blocks.sort((a, b) => a.order - b.order);
		}

		return themeOptionsData;
	},
};
