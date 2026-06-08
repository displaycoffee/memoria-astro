/* Type definitions */
type Events = Event;

type ObjectString = {
	[key: string]: string;
};

type ObjectPrimitive = {
	[key: string]: string | number | boolean;
};

/* Fetch type definitions */
type GraphQLParams = {
	url: string;
	query: string;
	variables?: object;
};

/* WordPress type definitions */
type MenuItem = {
	label: string;
	id: string;
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

type Post = {
	author: string;
	content: string;
	date: string;
	excerpt: string;
	id: number;
	image: {
		alt: string;
		url: string;
	};
	title: string;
	url: string;
};

type PostRaw = {
	author?: {
		node: {
			name: string;
		};
	};
	content: string;
	date: string;
	excerpt: string;
	featuredImage?: {
		node: {
			altText?: string;
			sourceUrl: string;
		};
	};
	postId: number;
	slug: string;
	title: string;
};

type Posts = Post[];

type PostsRaw = PostRaw[];

type ThemeOptionsRaw = {
	socialFacebook: string;
	socialInstagram: string;
	socialTwitter: string;
	socialGithub: string;
	sidebarSlug: string;
	headerLogo: {
		altText?: string;
		sourceUrl: string;
	};
	footerBlock01Order: string;
	footerBlock01Content: string;
	footerBlock02Order: string;
	footerBlock02Content: string;
	footerBlock03Order: string;
	footerBlock03Content: string;
};

declare global {
	/* Declare global types */
	type EventsType = Events;

	type ObjectStringType = ObjectString;

	type ObjectPrimitiveType = ObjectPrimitive;

	/* Declare global prop types */
	type ObjectPrimitiveProps = ObjectPrimitive;

	/* Declare global fetch types */
	type GraphQLParamsType = GraphQLParams;

	/* Declare global WordPress types */
	type MenuItemType = MenuItem;

	type MenuType = Menu;

	type MenuRawType = MenuRaw;

	type PostType = Post;

	type PostRawType = PostRaw;

	type PostsType = Posts;

	type PostsRawType = PostsRaw;

	type ThemeOptionsRawType = ThemeOptionsRaw;
}

/* Export global types */
export {};
