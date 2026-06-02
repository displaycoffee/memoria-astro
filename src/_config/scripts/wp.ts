/* Scripts */
import { utils } from './utils';
import { variables } from './variables';

export const wp = {
	posts: async () => {
		let postsData = [];

		// Get posts data
		const data = await utils.any.fetch({
			url: variables.urls.graphQL,
			query: `query Posts {
				posts(first: 10) {
					nodes {
						content
						date
						slug
						title
					}
				}
			}`,
		});

		// Format and set data
		if (data?.posts?.nodes) {
			const posts = data.posts.nodes;
			postsData = posts;
		}

		return postsData;
	},
	search: async (query: string, url = variables.urls.graphQL) => {
		let searchData = [];

		// Get posts data
		const data = await utils.any.fetch({
			url,
			query: `query Search($query: String) {
				posts(first: 12, where: { search: $query }) {
					nodes {
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
								sourceUrl(size: LARGE)
							}
						}
						postId
						slug
						title
					}
				}
			}`,
			variables: { query },
		});

		// Format and set data
		if (data?.posts?.nodes) {
			const search = data.posts.nodes.map((node: ResultCardUnformattedType) => {
				// Truncate and strip HTML from excerpt
				const excerpt = utils.any.truncate(utils.any.stripHTML(node.excerpt), 300);

				// Create image properties
				const image = {
					alt: node?.featuredImage?.node?.altText ? node.featuredImage.node.altText : `${node.title} - Logo`,
					url: node?.featuredImage?.node?.sourceUrl ? node.featuredImage.node.sourceUrl : '/assets/images/theme/placeholder.jpg',
				};

				// Return formatted data
				return {
					author: node?.author?.node?.name ? node.author.node.name : 'Unknown',
					content: node.content,
					date: utils.any.getDate(node.date),
					excerpt: excerpt,
					id: node.postId,
					image: image,
					title: node.title,
					url: `/${node.slug}`,
				};
			});
			searchData = search;
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
