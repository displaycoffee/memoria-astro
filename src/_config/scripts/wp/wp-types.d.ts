/* Type definitions */
type Author = {
	avatar: Image;
	description: string;
	id: string;
	name: string;
	slug: string;
	url: string;
};

type Authors = Author[];

type AuthorRaw = {
	avatar?: {
		url: string;
	};
	description?: string;
	name: string;
	slug: string;
	uri: string;
	userId: number;
};

type AuthorRawNode = {
	node: AuthorRaw;
};

type AuthorRawNodes = {
	nodes: AuthorRaw[];
};

type Category = {
	id: string;
	name: string;
	slug: string;
	url: string;
};

type Categories = Category[];

type CategoryRaw = {
	categoryId: number;
	name: string;
	slug: string;
	uri: string;
};

type CategoryRawNode = {
	node: CategoryRaw;
};

type CategoryRawNodes = {
	nodes: CategoryRaw[];
};

type GraphQLQueryFormat = 'node' | 'nodes' | 'query' | 'query-node' | 'query-nodes' | 'query-search' | 'none';

type GraphQLParams = {
	query: string;
	url: string;
	variables?: object;
};

type Image = {
	alt: string;
	url: string;
};

type Images = Image[];

type ImageRaw = {
	altText?: string;
	sourceUrl?: string;
};

type ImageRawNode = {
	node: ImageRaw;
};

type ImageRawNodes = {
	nodes: ImageRaw[];
};

type MenuItem = {
	id: string;
	label: string;
	type: string;
	url: string;
};

type Menu = MenuItem & {
	children: MenuItem[];
};

type MenuItemRaw = {
	connectedObject?: {
		__typename: string;
	};
	label: string;
	menuItemId: string;
	url: string;
};

type MenuRawNodes = MenuItemRaw & {
	childItems?: {
		nodes: MenuItemRaw[];
	};
};

type Page = {
	author: Author;
	content: string;
	date: string;
	excerpt: string;
	id: string;
	image: Image;
	slug: string;
	title: string;
	url: string;
};

type Pages = Page[];

type PageRaw = {
	author?: AuthorRawNode;
	content: string;
	date: string;
	featuredImage?: ImageRawNode;
	pageId: number;
	slug: string;
	title: string;
	uri: string;
};

type PagesRaw = PageRaw[];

type Post = {
	author: Author;
	categories: Categories;
	content: string;
	date: string;
	excerpt: string;
	id: string;
	image: Image;
	slug: string;
	tags: Tags;
	title: string;
	url: string;
};

type Posts = Post[];

type PostRaw = {
	author?: AuthorRawNode;
	categories: CategoryRawNodes;
	content: string;
	date: string;
	excerpt: string;
	featuredImage?: ImageRawNode;
	postId: number;
	slug: string;
	tags: TagRawNodes;
	title: string;
	uri: string;
};

type PostsRaw = PostRaw[];

type Site = {
	description: string;
	pageSize: number;
	title: string;
	url: string;
};

type SiteRaw = {
	description: string;
	postsPerPage: number;
	title: string;
};

type Tag = {
	id: string;
	name: string;
	slug: string;
	url: string;
};

type Tags = Tag[];

type TagRaw = {
	tagId: number;
	name: string;
	slug: string;
	uri: string;
};

type TagRawNode = {
	node: TagRaw;
};

type TagRawNodes = {
	nodes: TagRaw[];
};

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
	footerBlock04Order: string;
	headerLogo?: {
		altText?: string;
		sourceUrl: string;
	};
	sidebarSlug: string;
	socialFacebook: string;
	socialGithub: string;
	socialInstagram: string;
	socialLinkedIn: string;
	socialTwitch: string;
	socialTwitter: string;
	socialX: string;
	socialYouTube: string;
};

type WP = {
	menu: (id: string) => Promise<Menu[]>;
	page: (uri: string) => Promise<Page | null>;
	pages: (pageSize: number) => Promise<Pages>;
	post: (uri: string) => Promise<Post | null>;
	posts: (pageSize: number) => Promise<Posts>;
	search: (query: string, pageSize: number, url?: string) => Promise<Posts>;
	site: () => Promise<Site>;
	themeOptions: () => Promise<ThemeOptions>;
};

declare global {
	/* Declare global types */
	type AuthorType = Author;

	type AuthorsType = Authors;

	type AuthorRawType = AuthorRaw;

	type AuthorRawNodeType = AuthorRawNode;

	type AuthorRawNodesType = AuthorRawNodes;

	type CategoryType = Category;

	type CategoriesType = Categories;

	type CategoryRawType = CategoryRaw;

	type CategoryRawNodeType = CategoryRawNode;

	type CategoryRawNodesType = CategoryRawNodes;

	type GraphQLParamsType = GraphQLParams;

	type GraphQLQueryFormatType = GraphQLQueryFormat;

	type ImageType = Image;

	type ImagesTypes = Images;

	type ImageRawType = ImageRaw;

	type ImageRawNodeType = ImageRawNode;

	type ImageRawNodesType = ImageRawNodes;

	type MenuItemType = MenuItem;

	type MenuType = Menu;

	type MenuItemRawType = MenuItemRaw;

	type MenuRawNodesType = MenuRawNodes;

	type PageType = Page;

	type PagesType = Pages;

	type PageRawType = PageRaw;

	type PagesRawType = PagesRaw;

	type PostType = Post;

	type PostsType = Posts;

	type PostRawType = PostRaw;

	type PostsRawType = PostsRaw;

	type SiteType = Site;

	type SiteRawType = SiteRaw;

	type TagType = Tag;

	type TagsType = Tags;

	type TagRawType = TagRaw;

	type TagRawNodeType = TagRawNode;

	type TagRawNodesType = TagRawNodes;

	type ThemeOptionsType = ThemeOptions;

	type ThemeOptionsRawType = ThemeOptionsRaw;

	type WPType = WP;
}

/* Export global types */
export {};
