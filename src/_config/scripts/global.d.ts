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
	type PostType = Post;

	type PostRawType = PostRaw;

	type PostsType = Posts;

	type PostsRawType = PostsRaw;
}

/* Export global types */
export {};
