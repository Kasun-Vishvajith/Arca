import type { apps_config } from '🍎/configs/apps/apps-config';

export type AppID = keyof typeof apps_config;

export const apps = $state({
	open: {
		vault: false,
		files: false,
		media: false,
		transfer: false,
		ai: false,
		settings: false,
	} as Record<AppID, boolean>,

	active: 'vault' satisfies AppID,

	/**
	 * Maximum zIndex for the active app
	 * Initialize with -2, so that it becomes 0 when initialised
	 */
	active_z_index: -2,

	z_indices: {
		vault: 0,
		files: 0,
		media: 0,
		transfer: 0,
		ai: 0,
		settings: 0,
	} as Record<AppID, number>,

	is_being_dragged: false as boolean,

	fullscreen: {
		vault: false,
		files: false,
		media: false,
		transfer: false,
		ai: false,
		settings: false,
	} as Record<AppID, boolean>,
});
