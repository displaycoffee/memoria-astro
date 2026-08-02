/* Type definitions */
type Dropdown = {
	buttonLabel?: string;
	children: ReactNode;
	closeOnClick?: boolean;
	id: string;
};

type DropdownButton = {
	buttonLabel: string;
	buttonLinkClass?: string;
	buttonUrl?: string;
	closeContent: MouseEvent<HTMLAnchorElement>;
	contentId: string;
	isExpanded: boolean;
	toggleDropdown: MouseEvent<HTMLButtonElement>;
};

type DropdownButtonAttributes = HTMLAttributes<HTMLDivElement>;

type DropdownContent = {
	children: ReactNode;
	closeContent: MouseEvent<HTMLDivElement>;
	contentId: string;
};

/* Export types */
export type DropdownButtonAttributesType = DropdownButtonAttributes;

/* Export prop types */
export type DropdownProps = Dropdown;

export type DropdownButtonProps = DropdownButton;

export type DropdownContentProps = DropdownContent;
