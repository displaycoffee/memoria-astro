/* Type definitions */
type SlideoutButton = {
	outside: boolean;
	show: boolean;
};

type SlideoutOptions = {
	children?: ReactNode;
	options: {
		button: SlideoutButton;
		closeOnClick: boolean;
		direction?: string;
		id: string;
		label: string;
		orientation?: string;
		width?: number;
	};
};

/* Export prop types */
export type SlideoutProps = SlideoutOptions;
