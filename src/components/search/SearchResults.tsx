/* Styles */
import './styles/search-results.scss';

/* Packages */
import { useState, useEffect } from 'react';

/* Scripts */
import type { SearchResultsProps } from './scripts/search-types';
import { context } from '../../context/scripts/context';

/* Components */
import { Image } from '../image/Image';

export const SearchResults = (props: SearchResultsProps) => {
	const graphqlUrl = props.graphqlUrl;
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<ResultCardsTypes>([]);
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
				const data = await context.wp.search(q, graphqlUrl);
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
		<div className="search-results spacing-reset">
			<h2>Search results for "{query}"</h2>

			{error ? (
				<p>{error}</p>
			) : loading ? (
				<p>Loading...</p>
			) : results.length !== 0 ? (
				<div className="results row row-wrap row-spacing-20">
					{results.map((result) => {
						return (
							<div id={`result-${result.id}`} className="result column column-width-33" key={result.id}>
								<div className="result-image">
									<a href={result.url}>
										<Image
											alt={result.image.alt}
											hasLazy={true}
											image={result.image.url}
											wrapperClass={'image-wrapper image-wrapper-fluid image-wrapper-fit'}
										/>
									</a>
								</div>

								<div className="result-details">
									<h3 className="h5">
										<a href={result.url}>{result.title}</a>
									</h3>

									<p>
										By {result.author} on {result.date}
									</p>

									<p>{result.excerpt}</p>

									<a className="button" href={result.url}>
										Read More
									</a>
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<p>No results found.</p>
			)}
		</div>
	);
};
