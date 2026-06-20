/* Scripts */
import { wpAuthor } from './wp-author';
import { wpCategory } from './wp-category';
import { wpMenu } from './wp-menu';
import { wpPage } from './wp-page';
import { wpPost } from './wp-post';
import { wpSite } from './wp-site';
import { wpTag } from './wp-tag';
import { wpThemeOptions } from './wp-theme-options';

/* Query functions for WordPress data */
export const wp: WPType = {
	author: {
		all: wpAuthor.fetch.all,
		authors: wpAuthor.fetch.authors,
	},
	category: {
		all: wpCategory.fetch.all,
		categories: wpCategory.fetch.categories,
	},
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
		author: wpPost.fetch.author,
		category: wpPost.fetch.category,
		post: wpPost.fetch.post,
		posts: wpPost.fetch.posts,
		search: wpPost.fetch.search,
		tag: wpPost.fetch.tag,
	},
	site: {
		site: wpSite.fetch.site,
	},
	tag: {
		all: wpTag.fetch.all,
		tags: wpTag.fetch.tags,
	},
	themeOptions: {
		themeOptions: wpThemeOptions.fetch.themeOptions,
	},
};
