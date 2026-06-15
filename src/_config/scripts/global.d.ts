/* Type definitions */
type Events = Event;

type GraphQLQueryFormat = 'node' | 'nodes' | 'query' | 'query-node' | 'query-nodes' | 'none';

type GraphQLParams = {
	query: string;
	url: string;
	variables?: object;
};

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
		scrollTo: (e?: Events, selector?: string, offset?: number) => void;
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

declare global {
	/* Declare global types */
	type EventsType = Events;

	type GraphQLParamsType = GraphQLParams;

	type GraphQLQueryFormatType = GraphQLQueryFormat;

	type ObjectStringType = ObjectString;

	type ObjectPrimitiveType = ObjectPrimitive;

	type ThemeType = Theme;

	type UtilsType = Utils;

	type VariablesType = Variables;

	/* Declare global prop types */
	type ObjectPrimitiveProps = ObjectPrimitive;
}

/* Export global types */
export {};
