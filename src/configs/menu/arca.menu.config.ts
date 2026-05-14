import { create_menu_config } from '🍎/helpers/create-menu-config';

export const arca_menu_config = create_menu_config({
	default: {
		title: 'Arca',
		menu: {
			'about-arca': {
				title: 'About Arca',
				breakAfter: true,
			},
			settings: {
				title: 'Settings',
				breakAfter: true,
			},
			quit: {
				title: 'Quit',
			},
		},
	},
});
