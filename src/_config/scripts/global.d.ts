/* Type definitions */
type Events = SyntheticEvent | Event;

type ObjectString = {
	[key: string]: string;
};

type ObjectPrimitive = {
	[key: string]: string | number | boolean;
};

/* WordPress type definitions */
type Post = {
	title: {
		rendered: string;
	};
	content: {
		rendered: string;
	};
};

declare global {
	/* Declare global types */
	type EventsType = Events;

	type ObjectStringType = ObjectString;

	type ObjectPrimitiveType = ObjectPrimitive;

	/* Declare global prop types */
	type ObjectPrimitiveProps = ObjectPrimitive;

	/* Declare global WordPress types */
	type PostType = Post;
}

/* Export global types */
export {};
