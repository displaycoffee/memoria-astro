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
						title
						slug
						content
						date
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
				posts(first: 10, where: { search: $query }) {
					nodes {
						title
						slug
						content
						date
					}
				}
			}`,
			variables: { query },
		});

		// Format and set data
		if (data?.posts?.nodes) {
			const search = data.posts.nodes;
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
