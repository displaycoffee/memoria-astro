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
	title: string;
	content: string;
	slug: string;
	date: string;
};

type ResultCardFormatted = {
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

type ResultCardUnformatted = {
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

type ResultCards = ResultCardFormatted[];

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

	type ResultCardFormattedType = ResultCardFormatted;

	type ResultCardUnformattedType = ResultCardUnformatted;

	type ResultCardsTypes = ResultCards;
}

/* Export global types */
export {};
