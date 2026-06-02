/* Type definitions */
type SearchForm = {
	action: string;
	id: string;
};

type SearchResults = {
	graphqlUrl: string;
};

/* Export prop types */
export type SearchFormProps = SearchForm;

export type SearchResultsProps = SearchResults;
