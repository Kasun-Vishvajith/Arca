import { create_app_config } from '🍎/helpers/create-app-config.ts';

const vault = create_app_config({
	title: 'Vault',
	resizable: true,
	width: 760,
	height: 520,
});

const files = create_app_config({
	title: 'Files',
	resizable: true,
	width: 860,
	height: 560,
});

const media = create_app_config({
	title: 'Media',
	resizable: true,
	width: 800,
	height: 540,
});

const transfer = create_app_config({
	title: 'Transfer',
	resizable: false,
	width: 680,
	height: 480,
});

const ai = create_app_config({
	title: 'Arca AI',
	resizable: true,
	width: 680,
	height: 560,
});

const settings = create_app_config({
	title: 'Settings',
	resizable: false,
	width: 640,
	height: 480,
	dock_breaks_before: true,
});

export const apps_config = {
	vault,
	files,
	media,
	transfer,
	ai,
	settings,
};
