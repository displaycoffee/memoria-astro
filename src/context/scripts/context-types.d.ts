/* Type definitions */
type ContextValues = {
	theme: {
		[key: string]: ObjectPrimitiveType;
	};
	utils: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: (...args: any[]) => any;
	};
	variables: {
		[key: string]: ObjectPrimitiveType;
	};
	wp: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: (...args: any[]) => any;
	};
};

/* Export types */
export type ContextValuesType = ContextValues;
