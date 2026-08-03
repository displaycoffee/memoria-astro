/* Styles */
import './styles/slideout.scss';

/* Packages */
import { type RefObject, useEffect, useRef } from 'react';

/* Scripts */
import type { SlideoutProps } from './scripts/slideout-types';
import { context } from '../../context/scripts/context';
import { slideout } from './scripts/slideout';

/* Components */
import { Icon } from '../icons/Icons';

export const Slideout = (props: SlideoutProps) => {
	const { children, options } = props;
	const { config, get, toggle } = slideout;
	const slideoutId = `slideout-${options.id}`;
	const slideoutTitle = `${slideoutId}-title`;

	// Get default attributes for slideout
	const width = options?.width ?? config.values.width;
	const direction = options?.direction ?? config.values.direction;
	const orientation = get.orientation(direction);
	const styles = {
		width: width,
		transition: `${direction} 0.5s ease-in-out`,
		[direction]: orientation === 'vertical' ? config.values.vertical : `-${width}`,
	};

	// Create shared slideout button
	const slideoutButton = (
		<button className="slideout-button unstyled pointer" type="button" aria-label="Slideout button" onClick={(e) => toggle(e, slideoutId)}>
			<Icon id={'equalizer'} size={'large'} />
			{options.label}
		</button>
	);

	// Set button properties
	const button = typeof options?.button === 'object' ? options.button : { outside: false, show: true };

	return button.outside && button.show ? (
		slideoutButton
	) : (
		<div
			id={slideoutId}
			className={`${config.classes.slideout} slideout-${orientation}`}
			data-width={width}
			data-direction={direction}
			data-orientation={orientation}
		>
			{!button.outside && button.show ? slideoutButton : null}

			<div className={config.classes.menu} style={styles} inert role="dialog" aria-modal="true" aria-labelledby={slideoutTitle}>
				<header className="slideout-header flex-nowrap flex-align-items-center">
					<h2 id={slideoutTitle} className="slideout-title">
						{options.label}
					</h2>

					<button
						className="slideout-close pointer unstyled"
						type="button"
						aria-label="Slideout Close Button"
						onClick={(e) => toggle(e, false)}
					>
						<Icon id={'close-thin'} />
					</button>
				</header>

				<div className="slideout-scrollbar scrollbar">
					<div
						className="slideout-content"
						onClick={(e) => {
							const eventNode = e.target as Node;

							// Close slideout menu if inner link is clicked on
							if (eventNode?.nodeName) {
								if (eventNode.nodeName.toLowerCase() === 'a') {
									setTimeout(() => {
										toggle(e, false);
									});
								}
							}
						}}
						role="presentation"
					>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
};

export const SlideoutOverlay = () => {
	const { utils } = context;
	const { config, toggle } = slideout;
	const elementRef: RefObject<HTMLDivElement | null> = useRef(null);

	// Create overlay element and append to body on mount, remove on unmount
	useEffect(() => {
		const slideoutTarget = document.querySelector('body');
		if (!slideoutTarget) return;

		const overlay = document.createElement('div');
		utils.any.setAttributes(overlay, {
			class: 'slideout-overlay pointer',
			role: 'presentation',
		});
		overlay.onclick = (e) => toggle(e, false);
		slideoutTarget.appendChild(overlay);
		elementRef.current = overlay;

		return () => {
			overlay.remove();
			elementRef.current = null;
		};
	}, [utils, toggle]);

	// Close any active slideout(s) if the viewport crosses into desktop width
	// Note: unlike the React boilerplate, the slideout markup here is never unmounted (only CSS-hidden
	// via .hide-desktop), so this only needs to catch the case where it's left open across that crossing
	useEffect(() => {
		const activeSelector = `.${config.classes.slideout}.${config.classes.active}`;
		const mediaQuery = window.matchMedia(`(min-width: ${context.theme.bps.bp02}px)`);

		const handleChange = (e: MediaQueryListEvent) => {
			if (!e.matches) return;
			if (document.querySelectorAll(activeSelector).length === 0) return;
			toggle(e, false);
		};

		mediaQuery.addEventListener('change', handleChange);

		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [config, toggle]);

	// Close active slideout(s) when escape is pressed
	// Note: set.slideout already restores focus to whatever opened the menu
	useEffect(() => {
		const activeSelector = `.${config.classes.slideout}.${config.classes.active}`;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key !== 'Escape') return;
			if (document.querySelectorAll(activeSelector).length === 0) return;
			toggle(e, false);
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [config, toggle]);

	return null;
};
