/* Type definitions */
type Events = Event;

type ObjectString = {
	[key: string]: string;
};

type ObjectPrimitive = {
	[key: string]: Primitive;
};

type Primitive = string | number | boolean;

type Theme = {
	bps: {
		bp01: Primitive;
		bp02: Primitive;
		bp03: Primitive;
		bp04: Primitive;
	};
	colors: {
		color01: Primitive;
		color02: Primitive;
		color03: Primitive;
		color04: Primitive;
		color05: Primitive;
		color06: Primitive;
		color07: Primitive;
		color08: Primitive;
		color09: Primitive;
		color10: Primitive;
		color11: Primitive;
		color12: Primitive;
	};
};

type Utils = {
	any: {
		fetch: ({ url, query, variables = {} }: GraphQLParams) => Promise<T>;
		getDate: (time: string) => string;
		getLast: (value: string | string[], delimeter?: string) => string | number;
		handleize: (value: string) => string;
		sanitize: (string: string, maxLength = 200) => string;
		setAttributes: (element: HTMLElement, attributes: ObjectString) => void;
		stripHTML: (string: string) => string;
		truncate: (string: string, limit: number) => string;
	};
	browser: {
		getPage: () => string;
		isSticky: (element: HTMLElement | null, stickyClass: string) => void;
		scrollTo: (e?: EventsType, selector?: string, offset?: number) => void;
	};
};

type Variables = {
	urls: {
		api: string;
		base: string;
		graphQL: string;
		site: string;
		wp: string;
	};
};

type WP = {
	menu: (id: string) => Promise<Menu[]>;
	posts: (amount: number) => Promise<Posts>;
	search: (query: string, amount: number, url?: string) => Promise<Posts>;
	site: () => Promise<Site>;
	themeOptions: () => Promise<ThemeOptions>;
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

type Site = {
	description: string;
	title: string;
	url: string;
};

type SiteRaw = {
	description: string;
	title: string;
	url: string;
};

type ThemeOptions = {
	social: {
		label: string;
		url: string;
	}[];
	sidebar: {
		slug: string;
	};
	header: {
		logo: {
			alt: string;
			url: string;
		};
	};
	footer: {
		blocks: {
			order: number;
			content: string;
		}[];
	};
};

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

	type ThemeType = Theme;

	type UtilsType = Utils;

	type VariablesType = Variables;

	type WPType = WP;

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

	type SiteType = Site;

	type SiteRawType = SiteRaw;

	type ThemeOptionsType = ThemeOptions;

	type ThemeOptionsRawType = ThemeOptionsRaw;
}

/* Export global types */
export {};
