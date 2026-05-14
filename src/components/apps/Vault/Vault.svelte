<script lang="ts">
	// Vault password is stored in localStorage. Default: 'arca'
	const STORAGE_KEY_FILES = 'arca:vault:files';
	const STORAGE_KEY_PASS = 'arca:vault:password';

	type VaultFile = {
		name: string;
		size: number;
		date: string;
		type: string;
	};

	function getStoredPassword(): string {
		return localStorage.getItem(STORAGE_KEY_PASS) ?? 'arca';
	}

	function getStoredFiles(): VaultFile[] {
		try {
			return JSON.parse(localStorage.getItem(STORAGE_KEY_FILES) ?? '[]');
		} catch {
			return [];
		}
	}

	let unlocked = $state(false);
	let password_input = $state('');
	let shake = $state(false);
	let files = $state<VaultFile[]>(getStoredFiles());
	let drag_over = $state(false);

	function unlock() {
		if (password_input === getStoredPassword()) {
			unlocked = true;
			password_input = '';
		} else {
			shake = true;
			setTimeout(() => (shake = false), 500);
		}
	}

	function lock() {
		unlocked = false;
		password_input = '';
	}

	function persistFiles() {
		localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
	}

	function deleteFile(index: number) {
		files.splice(index, 1);
		persistFiles();
	}

	function handleFileInput(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files) return;
		addFiles(Array.from(input.files));
		input.value = '';
	}

	function addFiles(newFiles: File[]) {
		for (const f of newFiles) {
			files.push({
				name: f.name,
				size: f.size,
				date: new Date().toLocaleDateString(),
				type: f.type || 'unknown',
			});
		}
		persistFiles();
	}

	function formatSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		drag_over = true;
	}

	function onDragLeave() {
		drag_over = false;
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		drag_over = false;
		if (!unlocked || !e.dataTransfer?.files) return;
		addFiles(Array.from(e.dataTransfer.files));
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') unlock();
	}

	function getFileIcon(type: string): string {
		if (type.startsWith('image/')) return '🖼️';
		if (type.startsWith('video/')) return '🎬';
		if (type.startsWith('audio/')) return '🎵';
		if (type.includes('pdf')) return '📄';
		if (type.includes('zip') || type.includes('tar') || type.includes('gz')) return '📦';
		if (type.includes('text') || type.includes('json') || type.includes('xml')) return '📝';
		return '📎';
	}
</script>

<div
	class="vault-root"
	class:drag-over={drag_over && unlocked}
	ondragover={onDragOver}
	ondragleave={onDragLeave}
	ondrop={onDrop}
	role="region"
	aria-label="Vault"
>
	{#if !unlocked}
		<!-- LOCKED STATE -->
		<div class="locked-view">
			<div class="lock-icon">🔒</div>
			<h2 class="vault-title">Vault</h2>
			<p class="vault-hint">Default password: <code>arca</code></p>
			<input
				class="vault-input"
				class:error={shake}
				type="password"
				placeholder="Enter password"
				bind:value={password_input}
				onkeydown={handleKeydown}
				aria-label="Vault password"
			/>
			<button class="vault-btn primary" onclick={unlock}>Unlock</button>
		</div>
	{:else}
		<!-- UNLOCKED STATE -->
		<div class="unlocked-view">
			<div class="vault-topbar">
				<span class="vault-topbar-title">Vault</span>
				<span class="vault-file-count">{files.length} file{files.length !== 1 ? 's' : ''}</span>
				<span style="flex:1"></span>
				<button class="vault-btn icon-btn" onclick={lock} title="Lock Vault" aria-label="Lock Vault">
					🔒
				</button>
				<label class="vault-btn primary add-btn" title="Add file" aria-label="Add file">
					+ Add
					<input type="file" multiple onchange={handleFileInput} style="display:none" />
				</label>
			</div>

			<div class="file-list">
				{#if files.length === 0}
					<div class="empty-state">
						<span class="empty-icon">📂</span>
						<p>Drop files here</p>
					</div>
				{:else}
					{#each files as file, i}
						<div class="file-row">
							<span class="file-icon">{getFileIcon(file.type)}</span>
							<span class="file-name" title={file.name}>{file.name}</span>
							<span class="file-size">{formatSize(file.size)}</span>
							<span class="file-date">{file.date}</span>
							<button
								class="delete-btn"
								onclick={() => deleteFile(i)}
								title="Remove {file.name}"
								aria-label="Remove {file.name}"
							>✕</button>
						</div>
					{/each}
				{/if}
			</div>

			{#if drag_over}
				<div class="drop-overlay">Drop to add files</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.vault-root {
		height: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: hidden;
		transition: box-shadow 0.2s ease;
	}

	.vault-root.drag-over {
		box-shadow: inset 0 0 0 2px hsla(var(--system-color-primary-hsl, 210 100% 60%), 0.7);
	}

	/* ── Locked view ── */
	.locked-view {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 2rem;
	}

	.lock-icon {
		font-size: 3.5rem;
		line-height: 1;
		filter: drop-shadow(0 2px 8px rgba(0,0,0,0.25));
	}

	.vault-title {
		font-size: 1.3rem;
		font-weight: 700;
		font-family: var(--system-font-family);
		color: var(--system-color-light-contrast);
		margin: 0;
	}

	.vault-hint {
		font-size: 0.75rem;
		opacity: 0.45;
		font-family: var(--system-font-family);
		margin: 0;
		color: var(--system-color-light-contrast);
	}

	.vault-hint code {
		font-family: monospace;
		background: hsla(var(--system-color-dark-hsl), 0.1);
		border-radius: 3px;
		padding: 1px 4px;
	}

	.vault-input {
		width: 220px;
		padding: 0.5rem 0.75rem;
		border-radius: 0.4rem;
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.2);
		background: hsla(var(--system-color-light-hsl), 0.5);
		backdrop-filter: blur(8px);
		font-family: var(--system-font-family);
		font-size: 0.9rem;
		color: var(--system-color-light-contrast);
		outline: none;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.vault-input:focus {
		border-color: hsla(var(--system-color-primary-hsl, 210 100% 60%), 0.7);
		box-shadow: 0 0 0 2px hsla(var(--system-color-primary-hsl, 210 100% 60%), 0.25);
	}

	.vault-input.error {
		border-color: #e05050;
		box-shadow: 0 0 0 2px rgba(224, 80, 80, 0.3);
		animation: shake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97);
	}

	@keyframes shake {
		10%, 90%  { transform: translateX(-2px); }
		20%, 80%  { transform: translateX(4px); }
		30%, 50%, 70% { transform: translateX(-6px); }
		40%, 60%  { transform: translateX(6px); }
	}

	/* ── Buttons ── */
	.vault-btn {
		font-family: var(--system-font-family);
		font-size: 0.85rem;
		font-weight: 500;
		border-radius: 0.4rem;
		padding: 0.4rem 1rem;
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.18);
		background: hsla(var(--system-color-light-hsl), 0.45);
		color: var(--system-color-light-contrast);
		cursor: pointer;
		transition: background 0.15s ease, opacity 0.15s ease;
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.vault-btn:hover {
		background: hsla(var(--system-color-light-hsl), 0.7);
	}

	.vault-btn.primary {
		background: hsla(var(--system-color-primary-hsl, 210 100% 55%), 0.85);
		color: white;
		border-color: transparent;
	}

	.vault-btn.primary:hover {
		background: hsla(var(--system-color-primary-hsl, 210 100% 55%), 1);
	}

	.vault-btn.icon-btn {
		padding: 0.35rem 0.6rem;
		font-size: 1rem;
	}

	/* ── Unlocked view ── */
	.unlocked-view {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
	}

	.vault-topbar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0.6rem 0.9rem;
		border-bottom: 1px solid hsla(var(--system-color-dark-hsl), 0.12);
		background: hsla(var(--system-color-light-hsl), 0.25);
		flex-shrink: 0;
	}

	.vault-topbar-title {
		font-family: var(--system-font-family);
		font-weight: 600;
		font-size: 0.95rem;
		color: var(--system-color-light-contrast);
	}

	.vault-file-count {
		font-family: var(--system-font-family);
		font-size: 0.78rem;
		opacity: 0.5;
		color: var(--system-color-light-contrast);
	}

	.add-btn {
		cursor: pointer;
	}

	/* ── File list ── */
	.file-list {
		flex: 1;
		overflow-y: auto;
		padding: 0.4rem 0;
	}

	.file-row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0.45rem 0.9rem;
		border-bottom: 1px solid hsla(var(--system-color-dark-hsl), 0.06);
		font-family: var(--system-font-family);
		font-size: 0.85rem;
		color: var(--system-color-light-contrast);
		transition: background 0.1s ease;
	}

	.file-row:hover {
		background: hsla(var(--system-color-dark-hsl), 0.05);
	}

	.file-icon {
		font-size: 1.1rem;
		flex-shrink: 0;
	}

	.file-name {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 500;
	}

	.file-size {
		width: 64px;
		text-align: right;
		opacity: 0.55;
		flex-shrink: 0;
	}

	.file-date {
		width: 88px;
		text-align: right;
		opacity: 0.45;
		font-size: 0.78rem;
		flex-shrink: 0;
	}

	.delete-btn {
		flex-shrink: 0;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--system-color-light-contrast);
		opacity: 0.3;
		font-size: 0.85rem;
		padding: 2px 4px;
		border-radius: 4px;
		transition: opacity 0.15s ease, background 0.15s ease;
	}

	.delete-btn:hover {
		opacity: 0.9;
		background: rgba(224, 80, 80, 0.15);
		color: #e05050;
	}

	/* ── Empty state ── */
	.empty-state {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
		height: 100%;
		padding-top: 4rem;
		opacity: 0.35;
		font-family: var(--system-font-family);
		color: var(--system-color-light-contrast);
	}

	.empty-icon {
		font-size: 3rem;
	}

	/* ── Drag overlay ── */
	.drop-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: hsla(var(--system-color-primary-hsl, 210 100% 55%), 0.12);
		border: 2px dashed hsla(var(--system-color-primary-hsl, 210 100% 55%), 0.6);
		border-radius: 0.5rem;
		font-family: var(--system-font-family);
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--system-color-light-contrast);
		pointer-events: none;
	}
</style>
