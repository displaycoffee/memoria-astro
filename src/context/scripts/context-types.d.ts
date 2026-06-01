/* Type definitions */
type ContextValues = {
	theme: {
		[key: string]: ObjectPrimitiveType;
	};
	utils: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: { [key: string]: (...args: any[]) => any };
	};
	variables: {
		[key: string]: ObjectPrimitive;
	};
	wp: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: (...args: any[]) => any;
	};
};

/* Export types */
export type ContextValuesType = ContextValues;
