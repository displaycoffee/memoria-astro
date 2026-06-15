/* Scripts */
import { utils } from '../utils';
import { variables } from '../variables';

/* Main menu functions */
export const wpMenu = {
	format: (data: MenuRawNodesType, isChild: boolean) => {
		const menuItemPrefix = isChild ? 'menu-item-child' : 'menu-item';

		// Format menu data
		return {
			label: data.label,
			id: `${menuItemPrefix}-${data.menuItemId}`,
			url: data.url.replace(variables.urls.wp, ''),
		};
	},
	fetch: {
		menu: async (id: string) => {
			let menuData: MenuType[] = [];

			// Fetch menu data
			const data = await utils.any.fetch({
				url: variables.urls.graphQL,
				query: wpMenu.query(),
				variables: { id },
			});

			// Format and set data
			if (data?.menu?.menuItems?.nodes) {
				menuData = data.menu.menuItems.nodes.map((node: MenuRawNodesType) => {
					// Format main menu item
					const menu: MenuType = {
						children: [],
						...wpMenu.format(node, false),
					};

					// Then format children
					if (node?.childItems?.nodes && node.childItems.nodes.length !== 0) {
						menu.children = node.childItems.nodes.map((child) => {
							return wpMenu.format(child, true);
						});
					}

					return menu;
				});
			}

			return menuData;
		},
	},
	query: () => {
		// Shared query function for fetching menu data
		const urlAttrs = `
			label
			menuItemId
			url
		`;

		const query = `
			query Menu($id: ID!) {
				menu(id: $id, idType: NAME) {
					menuItems(first: 20, where: {parentId: 0}) {
						nodes {
							${urlAttrs}
							childItems(first: 20) {
								nodes {
									${urlAttrs}
								}
							}
						}
					}
				}
			}
		`;

		// Return query
		return query;
	},
};
