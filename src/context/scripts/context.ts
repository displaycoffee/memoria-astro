/* Scripts */
import type { ContextValuesType } from './context-types';
import { theme } from '../../_config/scripts/theme';
import { utils } from '../../_config/scripts/utils';
import { variables } from '../../_config/scripts/variables';
import { wp } from '../../_config/scripts/wp/wp';

/* Global context to use throughout Astro project */
export const context: ContextValuesType = {
	theme,
	utils,
	variables,
	wp,
};
