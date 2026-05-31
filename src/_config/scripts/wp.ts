/* Scripts */
import { context } from '../../context/scripts/context';

export const wp = {
	site: async() => {
		// Get site details
		const response = await fetch(`${context.variables.baseUrl}`);
		const site = await response.json();
		return site;
	}
}