/* Scripts */
import { wpMenu } from './wp-menu';
import { wpPage } from './wp-page';
import { wpPost } from './wp-post';
import { wpSite } from './wp-site';
import { wpThemeOptions } from './wp-theme-options';

/* Query functions for WordPress data */
export const wp: WPType = {
	menu: wpMenu.fetch.menu,
	page: wpPage.fetch.page,
	pages: wpPage.fetch.pages,
	post: wpPost.fetch.post,
	posts: wpPost.fetch.posts,
	search: wpPost.fetch.search,
	site: wpSite.fetch.site,
	themeOptions: wpThemeOptions.fetch.themeOptions,
};
