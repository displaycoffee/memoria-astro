/* Packages */
import { useState, useEffect } from 'react';

/* Scripts */
import type { ResultsType, SearchResultsProps } from './scripts/search-types';
import { wp } from '../../_config/scripts/wp';

export const SearchResults = (props: SearchResultsProps) => {
	const graphqlUrl = props.graphqlUrl;
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<ResultsType>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchResults = async () => {
			// Get search params and fetch query
			const params = new URLSearchParams(window.location.search);
			const q = params.get('q') || '';
			setQuery(q);

			// If no query, don't search
			if (!q) return;

			// If query is present, do search
			try {
				setLoading(true);
				const data = await wp.search(q, graphqlUrl);
				setResults(data);
			} catch {
				setError('Something went wrong. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		void fetchResults();
	}, [graphqlUrl]);

	return (
		<div className="search spacing-reset">
			<h2>Search results for "{query}"</h2>

			{error ? (
				<p>{error}</p>
			) : loading ? (
				<p>Loading...</p>
			) : results && results.length !== 0 ? (
				<div className="results">
					{results.map((result) => (
						<div className="result" key={result.slug}>
							<h2>{result.title}</h2>
							<div dangerouslySetInnerHTML={{ __html: result.content }} />
						</div>
					))}
				</div>
			) : (
				<p>No results found.</p>
			)}
		</div>
	);
};
