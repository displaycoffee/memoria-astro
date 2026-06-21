/* Styles */
import './styles/dropdown.scss';

/* Packages */
import { useState } from 'react';

/* Scripts */
import type { DropdownButtonAttributesType, DropdownProps, DropdownButtonProps, DropdownContentProps } from './scripts/dropdown-types';
import { context } from '../../context/scripts/context';
import { useClickOutside } from './scripts/dropdown-hooks';

/* Components */
import { Icon } from '../icons/Icons';

export const Dropdown = (props: DropdownProps) => {
	const { buttonLabel, children, closeOnClick, id } = props;
	const dropdownId = `dropdown-${context.utils.any.handleize(id)}`;
	const contentId = `${dropdownId}-content`;
	const [dropdown, setDropdown] = useState('');
	const isExpanded = dropdown === dropdownId;

	// Toggle dropdown state
	const toggleDropdown = () => {
		setDropdown(isExpanded ? '' : dropdownId);
	};

	// Detect click outside dropdown
	const dropdownRef = useClickOutside(() => setDropdown(''));

	// Determine if we should close dropdown when clicked inside
	const closeContent = () => {
		if (closeOnClick) {
			setDropdown('');
		}
	};

	return (
		<div id={dropdownId} className={`dropdown dropdown-${isExpanded ? 'expanded' : 'collapsed'}`} ref={dropdownRef}>
			<DropdownButton
				buttonLabel={buttonLabel || ''}
				closeContent={closeContent}
				contentId={contentId}
				isExpanded={isExpanded}
				toggleDropdown={toggleDropdown}
			/>
			<DropdownContent closeContent={closeContent} id={contentId}>
				{children}
			</DropdownContent>
		</div>
	);
};

export const DropdownButton = (props: DropdownButtonProps) => {
	const { buttonLabel, contentId, isExpanded, toggleDropdown } = props;

	// Create dropdown icon
	const icon = <Icon id={'angle-down'} />;

	// Set button attributes
	const buttonAttributes: DropdownButtonAttributesType = {
		className: 'dropdown-button-toggle unstyled',
		type: 'button',
		['aria-controls']: contentId,
		['aria-expanded']: isExpanded,
		['aria-label']: 'Dropdown button',
		onClick: toggleDropdown,
	};

	return (
		<div className="dropdown-button">
			<button {...buttonAttributes}>
				{buttonLabel}
				{icon}
			</button>
		</div>
	);
};

export const DropdownContent = (props: DropdownContentProps) => {
	const { children, closeContent, id } = props;

	return (
		<div id={id} className="dropdown-content margin-trim" onClick={closeContent} role="presentation">
			{children}
		</div>
	);
};
