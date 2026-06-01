export const utils = {
	any: {
		getLast: (value: string | [], delimeter?: string) => {
			let valueArray = [] as string[] | number[];
			if (Array.isArray(value)) {
				valueArray = value;
			} else if (delimeter) {
				valueArray = value.split(delimeter);
			}
			return valueArray[valueArray.length - 1];
		},
		handleize: (value: string) => {
			return value
				.toLowerCase()
				.replace(/[^\w\s]/g, '')
				.replace(/\s/g, '-')
				.trim();
		},
		setAttributes: (element: HTMLElement, attributes: ObjectStringType) => {
			for (const attribute in attributes) {
				element.setAttribute(attribute, attributes[attribute]);
			}
		},
	},
	browser: {
		getPage: () => {
			return window.location.pathname.split('/').slice(0, -1).join('/');
		},
		isSticky: (element: HTMLElement, stickyClass: string) => {
			if (element) {
				const stickyOptions = { threshold: [1] };
				const stickyCallback = (e: IntersectionObserverEntry) => {
					e.target.classList.toggle(stickyClass, e.intersectionRatio < 1);
				};

				const stickyObserver = new IntersectionObserver(([e]) => stickyCallback(e), stickyOptions);
				stickyObserver.observe(element);
			}
		},
		scrollTo: (e: EventsType, selector: string | undefined, offset: number) => {
			if (e) {
				e.preventDefault();
			}
			const anchor = {
				selector: selector,
				offset: offset ? offset : 0,
				position: () => {
					const anchorElement =
						anchor.selector && document.querySelector(anchor.selector) ? document.querySelector(anchor.selector) : false;
					return anchorElement ? anchorElement.getBoundingClientRect().top + window.scrollY - anchor.offset : 0 - anchor.offset;
				},
			};
			window.scroll({ top: anchor.position(), left: 0, behavior: 'smooth' });
		},
	},
	server: {
		fetch: async ({ url, query, variables = {} }: GraphQLParamsType) => {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query,
					variables,
				}),
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch WordPress data: ${response.statusText}`);
			}

			const json = await response.json();

			if (json.errors) {
				throw new Error(json.errors.map((e: { message: string }) => e.message).join(', '));
			}

			return json.data;
		},
	},
};
