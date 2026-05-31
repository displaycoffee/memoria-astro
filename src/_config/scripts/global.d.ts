/* Type definitions */
type Events = SyntheticEvent | Event;

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
	type PostType = Post;
}

/* Export global types */
export {};
