/* Type definitions */
type WP = {
	menu: (id: string) => Promise<Menu[]>;
	page: (uri: string) => Promise<Page | null>;
	post: (uri: string) => Promise<Post | null>;
	posts: (amount: number) => Promise<Posts>;
	search: (query: string, amount: number, url?: string) => Promise<Posts>;
	site: () => Promise<Site>;
	themeOptions: () => Promise<ThemeOptions>;
};

type Author = {
	avatar: Image;
	description: string;
	id: string;
	name: string;
	slug: string;
	url: string;
};

type AuthorRaw = {
	node: {
		avatar?: {
			url: string;
		};
		description?: string;
		id: string;
		name: string;
		slug: string;
		uri: string;
	};
};

type Category = {
	category: number;
	name: string;
	slug: string;
	url: string;
};

type CategoryRaw = {
	categoryId: number;
	name: string;
	slug: string;
	uri: string;
};

type Categories = Category[];

type CategoriesRaw = CategoryRaw[];

type Image = {
	alt: string;
	url: string;
};

type ImageRawAttributes = {
	altText?: string;
	sourceUrl?: string;
};

type ImageRaw = {
	node: ImageRawAttributes;
};

type MenuItem = {
	id: string;
	label: string;
	url: string;
};

type Menu = MenuItem & {
	children: MenuItem[];
};

type MenuRaw = MenuItem & {
	childItems?: {
		nodes: MenuItem[];
	};
};

type Page = {
	author: Author;
	content: string;
	date: string;
	excerpt: string;
	id: number;
	image: Image;
	slug: string;
	title: string;
	url: string;
};

type PageRaw = {
	author?: AuthorRaw;
	content: string;
	date: string;
	featuredImage?: ImageRaw;
	pageId: number;
	slug: string;
	title: string;
	uri: string;
};

type Pages = Page[];

type PagesRaw = PageRaw[];

type Post = {
	author: Author;
	content: string;
	date: string;
	excerpt: string;
	id: number;
	image: Image;
	slug: string;
	title: string;
	url: string;
};

type PostRaw = {
	author?: AuthorRaw;
	categories: {
		nodes: {
			categoryId: number;
			name: string;
			slug: string;
			uri: string;
		}[];
	};
	content: string;
	date: string;
	excerpt: string;
	featuredImage?: ImageRaw;
	postId: number;
	slug: string;
	tags: {
		nodes: {
			name: string;
			slug: string;
			tagId: number;
			uri: string;
		}[];
	};
	title: string;
	uri: string;
};

type Posts = Post[];

type PostsRaw = PostRaw[];

type Site = {
	description: string;
	title: string;
	url: string;
};

type SiteRaw = {
	description: string;
	title: string;
};

type Tag = {
	category: number;
	name: string;
	slug: string;
	url: string;
};

type TagRaw = {
	categoryId: number;
	name: string;
	slug: string;
	uri: string;
};

type Tags = Tag[];

type TagsRaw = TagRaw[];

type ThemeOptions = {
	footer: {
		blocks: {
			content: string;
			id: string;
			order: number;
		}[];
	};
	header: {
		logo: Image;
	};
	sidebar: {
		slug: string;
	};
	social: {
		id: string;
		label: string;
		url: string;
	}[];
};

type ThemeOptionsRaw = {
	footerBlock01Order: string;
	footerBlock01Content: string;
	footerBlock02Order: string;
	footerBlock02Content: string;
	footerBlock03Order: string;
	footerBlock03Content: string;
	headerLogo?: {
		altText?: string;
		sourceUrl: string;
	};
	sidebarSlug: string;
	socialFacebook: string;
	socialInstagram: string;
	socialTwitter: string;
	socialGithub: string;
};

declare global {
	/* Declare global types */
	type WPType = WP;

	type AuthorType = Author;

	type AuthorRawType = AuthorRaw;

	type CategoryType = Category;

	type CategoryRawType = CategoryRaw;

	type CategoriesType = Categories;

	type CategoriesRawType = CategoriesRaw;

	type ImageType = Image;

	type ImageRawAttributesType = ImageRawAttributes;

	type ImageRawType = ImageRaw;

	type MenuItemType = MenuItem;

	type MenuType = Menu;

	type MenuRawType = MenuRaw;

	type PageType = Page;

	type PageRawType = PageRaw;

	type PagesType = Pages;

	type PagesRawType = PagesRaw;

	type PostType = Post;

	type PostRawType = PostRaw;

	type PostsType = Posts;

	type PostsRawType = PostsRaw;

	type SiteType = Site;

	type SiteRawType = SiteRaw;

	type TagType = Tag;

	type TagRawType = TagRaw;

	type TagsType = Tags;

	type TagsRawType = TagsRaw;

	type ThemeOptionsType = ThemeOptions;

	type ThemeOptionsRawType = ThemeOptionsRaw;
}

/* Export global types */
export {};
