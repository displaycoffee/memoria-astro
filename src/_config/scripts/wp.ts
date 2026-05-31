/* Scripts */
import { utils } from './utils';
import { variables } from './variables';

export const wp = {
	posts: async () => {
		const data = await utils.fetch({
			url: variables.graphQLUrl,
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
		const response = await fetch(`${variables.baseUrl}`);
		const site = await response.json();
		return site;
	},
};
