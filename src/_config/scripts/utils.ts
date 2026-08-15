/* Track the element that opened each trapped container, so focus can be restored to it on close */
const trapOpenerElements = new WeakMap<HTMLElement, HTMLElement>();

/* Track each container's Tab-trap handler, so it can be removed again on close */
const trapHandlers = new WeakMap<HTMLElement, (e: KeyboardEvent) => void>();

export const utils: UtilsType = {
	any: {
		fetch: async ({ url, query, variables = {} }: GraphQLParamsType) => {
			// Fetch data from WordPress
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 30000);

			try {
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						query,
						variables,
					}),
					signal: controller.signal,
				});

				if (!response.ok) {
					throw new Error(`Failed to fetch WordPress data: ${response.statusText}`);
				}

				const json = await response.json();

				if (json.errors) {
					throw new Error(json.errors.map((e: { message: string }) => e.message).join(', '));
				}

				return json.data;
			} finally {
				clearTimeout(timeout);
			}
		},
		getDate: (time: string) => {
			// Get date
			const date = new Date(time);
			return date.toLocaleDateString('en-US', {
				month: 'long',
				day: '2-digit',
				year: 'numeric',
			});
		},
		getLast: (value: string | string[], delimeter?: string) => {
			// Get last item in array
			let valueArray: string[] | number[] = [];
			if (Array.isArray(value)) {
				valueArray = value;
			} else if (delimeter) {
				valueArray = value.split(delimeter);
			}
			return valueArray[valueArray.length - 1] ?? '';
		},
		handleize: (value: string) => {
			// Format value for html classes
			return value
				.toLowerCase()
				.trim()
				.replace(/[^\w\s]/g, '')
				.replace(/\s/g, '-');
		},
		sanitize: (string: string, maxLength = 200) => {
			// Strip HTML, collapse whitespace, and enforce a max length
			return utils.any.stripHTML(string).replace(/\s+/g, ' ').slice(0, maxLength);
		},
		setAttributes: (element: HTMLElement, attributes: ObjectStringType) => {
			// Set multiple attributes on an element
			for (const attribute in attributes) {
				element.setAttribute(attribute, attributes[attribute]);
			}
		},
		stripHTML: (string: string) => {
			// Remove HTML from string
			if (!string) return '';
			return string
				.replace(/\n/g, ' ')
				.replace(/<[^>]*>/g, '')
				.trim();
		},
		truncate: (string: string, limit: number) => {
			// Limit characters in string
			if (string.length > limit) {
				return `${string.slice(0, limit - 3)}...`;
			} else {
				return string;
			}
		},
	},
	browser: {
		focusTrap: {
			activate: (container: HTMLElement, focusSelector?: string) => {
				// Remember what had focus, move focus into the container (or a specific element within it), and trap Tab/Shift+Tab
				const opener = document.activeElement as HTMLElement | null;
				if (opener) trapOpenerElements.set(container, opener);

				// Focus on taget selector or container
				const target = (focusSelector ? container.querySelector<HTMLElement>(focusSelector) : null) ?? container;
				target.focus();

				// Selector for elements that can receive focus, used to trap Tab within the container
				const notDisabled = ':not([disabled])';
				const notTabIndex = ':not([tabindex="-1"])';
				const focusableSelector = `a[href], button${notDisabled}, input${notDisabled}, select${notDisabled}, textarea${notDisabled}, [tabindex]${notTabIndex}`;

				// Exclude elements matched by focusableSelector that are hidden (e.g. a collapsed dropdown's content)
				// and therefore not actually reachable via Tab, even though they match the selector
				const isFocusable = (element: HTMLElement) => {
					const style = getComputedStyle(element);
					return style.visibility !== 'hidden' && style.display !== 'none';
				};

				// Keep Tab / Shift + Tab cycling within the container while it's open
				const handleTrap = (e: KeyboardEvent) => {
					// If not the tab key, exit
					if (e.key !== 'Tab') return;

					// If no focusable elements, exit
					const focusable = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(isFocusable);
					if (focusable.length === 0) return;

					// Get first and last focusable elements
					const first = focusable[0];
					const last = focusable[focusable.length - 1];

					// Focus on first or last elements
					if (e.shiftKey && document.activeElement === first) {
						e.preventDefault();
						last.focus();
					} else if (!e.shiftKey && document.activeElement === last) {
						e.preventDefault();
						first.focus();
					}
				};

				// Save the handler so it can be removed on deactivate, then start trapping Tab
				trapHandlers.set(container, handleTrap);
				container.addEventListener('keydown', handleTrap);
			},
			deactivate: (container: HTMLElement) => {
				// Remove the Tab trap and restore focus to whatever opened the container
				const handleTrap = trapHandlers.get(container);
				if (handleTrap) {
					container.removeEventListener('keydown', handleTrap);
					trapHandlers.delete(container);
				}

				// Restore focus to whatever opened the container, then forget it
				trapOpenerElements.get(container)?.focus();
				trapOpenerElements.delete(container);
			},
		},
		getPage: () => {
			// Get previous / parent page
			return window.location.pathname.split('/').slice(0, -1).join('/');
		},
		isSticky: (element: HTMLElement | null, stickyClass: string) => {
			if (element) {
				// Create options and callback for observer
				const stickyOptions = { threshold: [1] };
				const stickyCallback = (e: IntersectionObserverEntry) => {
					e.target.classList.toggle(stickyClass, e.intersectionRatio < 1);
				};

				// Observe to toggle sticky class
				const stickyObserver = new IntersectionObserver(([e]) => stickyCallback(e), stickyOptions);
				stickyObserver.observe(element);
			}
		},
		scrollTo: (e?: EventsType, selector?: string, offset?: number) => {
			// Scroll to element on page
			if (e) {
				e.preventDefault();
			}
			const anchor = {
				selector: selector ?? '',
				offset: offset ?? 0,
				position: () => {
					const anchorElement = anchor.selector ? document.querySelector(anchor.selector) : false;
					return anchorElement ? anchorElement.getBoundingClientRect().top + window.scrollY - anchor.offset : -anchor.offset;
				},
			};
			window.scroll({ top: anchor.position(), left: 0, behavior: 'smooth' });
		},
	},
};
