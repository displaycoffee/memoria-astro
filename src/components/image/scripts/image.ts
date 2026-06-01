export const image = {
	placeholder: '/assets/images/theme/placeholder.jpg',
	loading: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
	getErrorImage: (src: string) => {
		// Determine if error placeholder has been set
		return src == image.placeholder || src.includes(image.placeholder) ? image.loading : image.placeholder;
	},
	onError: (e: EventsType) => {
		// Handle error imaging if image has src or srcset
		const target = e.target as HTMLImageElement;
		if (target.getAttribute('src')) {
			target.src = image.getErrorImage(target.src);
		}
		if (target.getAttribute('srcset')) {
			target.srcset = image.getErrorImage(target.src);
		}
	},
	onLoad: (e: EventsType) => {
		// Set natural image widths and height on load
		const target = e.target as HTMLImageElement;
		target.setAttribute('width', String(target.naturalWidth));
		target.setAttribute('height', String(target.naturalHeight));
	},
};
