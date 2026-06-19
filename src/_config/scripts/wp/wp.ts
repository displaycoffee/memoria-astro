/* Scripts */
import { wpMenu } from './wp-menu';
import { wpPage } from './wp-page';
import { wpPost } from './wp-post';
import { wpSite } from './wp-site';
import { wpThemeOptions } from './wp-theme-options';

/* Query functions for WordPress data */
export const wp: WPType = {
	menu: {
		menu: wpMenu.fetch.menu,
	},
	page: {
		all: wpPage.fetch.all,
		page: wpPage.fetch.page,
		pages: wpPage.fetch.pages,
	},
	post: {
		all: wpPost.fetch.all,
		post: wpPost.fetch.post,
		posts: wpPost.fetch.posts,
		search: wpPost.fetch.search,
	},
	site: {
		site: wpSite.fetch.site,
	},
	themeOptions: {
		themeOptions: wpThemeOptions.fetch.themeOptions,
	},
};
