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
