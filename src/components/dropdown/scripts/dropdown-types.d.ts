import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode, RefObject } from 'react';

/* Type definitions */
type Dropdown = {
	buttonLabel: string;
	children: ReactNode;
	closeOnClick?: boolean;
	id: string;
	showLabel?: boolean;
};

type DropdownButton = {
	buttonLabel: string;
	buttonLinkClass?: string;
	buttonRef: RefObject<HTMLButtonElement | null>;
	buttonUrl?: string;
	closeContent: MouseEventHandler<HTMLAnchorElement>;
	contentId: string;
	isExpanded: boolean;
	showLabel?: boolean;
	toggleDropdown: MouseEventHandler<HTMLButtonElement>;
};

type DropdownButtonAttributes = ButtonHTMLAttributes<HTMLButtonElement>;

type DropdownContent = {
	children: ReactNode;
	closeContent: MouseEventHandler<HTMLDivElement>;
	contentId: string;
};

/* Export types */
export type DropdownButtonAttributesType = DropdownButtonAttributes;

/* Export prop types */
export type DropdownProps = Dropdown;

export type DropdownButtonProps = DropdownButton;

export type DropdownContentProps = DropdownContent;
