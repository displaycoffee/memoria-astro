/* Scripts */
import { utils } from './utils';
import { variables } from './variables';

export const wp = {
	posts: async () => {
		let postsData = [];

		// Get posts data
		const data = await utils.server.fetch({
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
	site: async () => {
		let siteData = {};

		// Get site details
		const data = await utils.server.fetch({
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
					//url: generalSettings?.siteIcon?.node?.sourceUrl ? generalSettings.siteIcon.node.sourceUrl : '',
					url: 'https://memoria.ddev.site/wp-content/uploads/2025/11/cropped-coffee-bean-112-300aaax300.png',
				},
				title: generalSettings.title,
				url: variables.urls.site,
			};
		}

		return siteData;
	},
};
