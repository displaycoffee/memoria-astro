/* Styles */
import './styles/dropdown.scss';

/* Packages */
import { useEffect, useRef, useState } from 'react';

/* Scripts */
import type { DropdownButtonAttributesType, DropdownProps, DropdownButtonProps, DropdownContentProps } from './scripts/dropdown-types';
import { useClickOutside } from './scripts/dropdown-hooks';
import { context } from '../../context/scripts/context';

/* Components */
import { Icon } from '../icons/Icons';

export const Dropdown = (props: DropdownProps) => {
	const { buttonLabel, children, closeOnClick, id } = props;
	const showLabel = props.showLabel ?? true;
	const dropdownId = `dropdown-${context.utils.any.handleize(id)}`;
	const contentId = `${dropdownId}-content`;
	const [dropdown, setDropdown] = useState('');
	const isExpanded = dropdown === dropdownId;
	const buttonRef = useRef<HTMLButtonElement>(null);

	// Close dropdown
	const closeDropdown = () => {
		setDropdown('');
	};

	// Toggle dropdown state
	const toggleDropdown = () => {
		setDropdown(isExpanded ? '' : dropdownId);
	};

	// Detect click outside dropdown
	const dropdownRef = useClickOutside(closeDropdown);

	// Close dropdown and return focus to the toggle button when Escape is pressed
	useEffect(() => {
		if (!isExpanded) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				closeDropdown();
				buttonRef.current?.focus();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isExpanded]);

	// Determine if we should close dropdown when clicked inside
	const closeContent = () => {
		if (closeOnClick) {
			setDropdown('');
		}
	};

	return (
		<div id={dropdownId} className={`dropdown dropdown-${isExpanded ? 'expanded' : 'collapsed'}`} ref={dropdownRef}>
			<DropdownButton
				buttonLabel={buttonLabel}
				buttonRef={buttonRef}
				closeContent={closeContent}
				contentId={contentId}
				isExpanded={isExpanded}
				showLabel={showLabel}
				toggleDropdown={toggleDropdown}
			/>
			<DropdownContent closeContent={closeContent} contentId={contentId}>
				{children}
			</DropdownContent>
		</div>
	);
};

export const DropdownButton = (props: DropdownButtonProps) => {
	const { buttonLabel, buttonRef, contentId, isExpanded, showLabel, toggleDropdown } = props;

	// Create dropdown icon
	const icon = <Icon id={'angle-down'} />;

	// Set button attributes
	const buttonAttributes: DropdownButtonAttributesType = {
		className: 'dropdown-button-toggle unstyled',
		type: 'button',
		['aria-controls']: contentId,
		['aria-expanded']: isExpanded,
		onClick: toggleDropdown,
	};

	// Add aria-label if no button label is set
	if (!showLabel) {
		buttonAttributes['aria-label'] = buttonLabel;
	}

	return (
		<div className="dropdown-button">
			<button {...buttonAttributes} ref={buttonRef}>
				{showLabel ? buttonLabel : ''}
				{icon}
			</button>
		</div>
	);
};

export const DropdownContent = (props: DropdownContentProps) => {
	const { children, closeContent, contentId } = props;

	return (
		<div id={contentId} className="dropdown-content margin-trim" onClick={closeContent} role="presentation">
			{children}
		</div>
	);
};
