/* Type definitions */
type Result = {
	title: string;
	content: string;
	slug: string;
	date: string;
};

type Results = Result[];

type SearchForm = {
	action: string;
	id: string;
};

type SearchResults = {
	graphqlUrl: string;
};

/* Export types */
export type ResultsType = Results;

/* Export prop types */
export type SearchFormProps = SearchForm;

export type SearchResultsProps = SearchResults;
