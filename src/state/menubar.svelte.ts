import { persisted } from './persisted.svelte.ts';
import { arca_menu_config } from '🍎/configs/menu/arca.menu.config';

const menu_configs = { arca: arca_menu_config };

export const should_show_notch = persisted('macos:setting:should-show-notch', false as boolean);

export const menubar_state = $state({
	menus: menu_configs.arca,
	active: '' as string,
});
