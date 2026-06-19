/* Packages */
import { useState, useEffect } from 'react';

/* Scripts */
import type { SearchResultsProps } from './scripts/search-types';
import { context } from '../../context/scripts/context';

/* Components */
import { PostList } from '../post/PostList';

export const SearchResults = (props: SearchResultsProps) => {
	const graphqlUrl = props.graphqlUrl;
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<PostsType>([]);
	const [loading, setLoading] = useState(false);
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

			// If query is present, do search
			try {
				setLoading(true);
				const data = await context.wp.post.search(q, 12, graphqlUrl);
				if (!cancelled) {
					setResults(data);
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

	return (
		<div className="search-results margin-trim">
			<h2>Search results for "{query}"</h2>

			{error ? <p>{error}</p> : loading ? <p>Loading...</p> : results.length !== 0 ? <PostList posts={results} /> : <p>No results found.</p>}
		</div>
	);
};
