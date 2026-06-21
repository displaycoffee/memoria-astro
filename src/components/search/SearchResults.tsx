/* Packages */
import { useState, useEffect } from 'react';

/* Scripts */
import type { SearchResultsProps } from './scripts/search-types';
import { context } from '../../context/scripts/context';

/* Components */
import { PostList } from '../post/PostList';

/* Search settings */
const pageSize = 12;

export const SearchResults = (props: SearchResultsProps) => {
	const graphqlUrl = props.graphqlUrl;
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<PostsType>([]);
	const [hasNextPage, setHasNextPage] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		let cancelled = false;

		const fetchResults = async () => {
			// Get search params and fetch query
			const params = new URLSearchParams(window.location.search);
			const q = context.utils.any.sanitize(params.get('q') || '');
			setQuery(q);

			// If no query, don't search
			if (!q) return;

			// Restore however many results were loaded before navigating away
			const loaded = parseInt(params.get('loaded') || '', 10);
			const count = loaded > pageSize ? loaded : pageSize;

			// If query is present, do search
			try {
				// Set loading
				setLoading(true);

				// Get data, set results, and next page (if not cancelled)
				const data = await context.wp.post.search(q, count, graphqlUrl);
				if (!cancelled) {
					setResults(data.posts);
					setHasNextPage(data.hasNextPage);
				}
			} catch {
				if (!cancelled) {
					setError('Something went wrong. Please try again.');
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		};

		void fetchResults();

		return () => {
			cancelled = true;
		};
	}, [graphqlUrl]);

	const handleLoadMore = async () => {
		try {
			// Set loading
			setLoadingMore(true);

			// Get data, set results, and next page
			const data = await context.wp.post.search(query, results.length + pageSize, graphqlUrl);
			setResults(data.posts);
			setHasNextPage(data.hasNextPage);

			// Remember how many results are loaded so navigating back restores them
			const params = new URLSearchParams(window.location.search);
			params.set('loaded', String(data.posts.length));
			window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
		} catch {
			setError('Something went wrong. Please try again.');
		} finally {
			setLoadingMore(false);
		}
	};

	return (
		<div className="search-results margin-trim">
			<h2>Search results for "{query}"</h2>

			{error ? (
				<p>{error}</p>
			) : loading ? (
				<p>Loading...</p>
			) : results.length !== 0 ? (
				<>
					<PostList posts={results} />

					{hasNextPage && (
						<div className="load-more">
							<button className="load-more-button button" type="button" disabled={loadingMore} onClick={handleLoadMore}>
								{loadingMore ? 'Loading...' : 'Load More'}
							</button>
						</div>
					)}
				</>
			) : (
				<p>No results found.</p>
			)}
		</div>
	);
};
