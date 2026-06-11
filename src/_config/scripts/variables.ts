/* This config contains variables to use through application */
export const variables: VariablesType = {
	urls: {
		api: import.meta.env.API_URL,
		base: import.meta.env.BASE_URL,
		graphQL: import.meta.env.GRAPHQL_URL,
		site: import.meta.env.SITE_URL,
		wp: import.meta.env.WP_URL,
	},
};
