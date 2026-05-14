<script lang="ts">
	import type { AppID } from '🍎/state/apps.svelte';

	const {
		app_id,
		is_being_dragged,
	}: {
		app_id: AppID;
		is_being_dragged: boolean;
	} = $props();
</script>

{#if app_id === 'vault'}
	{#await import('./Vault/Vault.svelte') then { default: Vault }}
		<Vault />
	{/await}
{:else if app_id === 'files'}
	{#await import('./Files/Files.svelte') then { default: Files }}
		<Files />
	{/await}
{:else if app_id === 'media'}
	{#await import('./Media/Media.svelte') then { default: Media }}
		<Media />
	{/await}
{:else if app_id === 'transfer'}
	{#await import('./Transfer/Transfer.svelte') then { default: Transfer }}
		<Transfer />
	{/await}
{:else if app_id === 'ai'}
	{#await import('./ArcaAI/ArcaAI.svelte') then { default: ArcaAI }}
		<ArcaAI />
	{/await}
{:else if app_id === 'settings'}
	{#await import('./Settings/Settings.svelte') then { default: Settings }}
		<Settings />
	{/await}
{/if}
