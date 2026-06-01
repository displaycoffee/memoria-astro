/* Scripts */
import { utils } from './utils';
import { variables } from './variables';

export const wp = {
	posts: async () => {
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

		return data?.posts?.nodes || [];
	},
	site: async () => {
		// Get site details
		const data = await utils.server.fetch({
			url: variables.urls.graphQL,
			query: `query Settings {
				generalSettings {
					description
					title
					url
				}
			}`,
		});

		return data?.generalSettings || {};
	},
};
