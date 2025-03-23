<script lang="ts">
	import emails from '$lib/assets/data/emails.json';
	import { getSenderName } from '$lib/util/getSenderName';
	import Folder from '$lib/components/Folder.svelte';
	import { tick, onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	interface Props {
		data: any;
	}

	interface MovingFolder {
		sender: string;
		subjects: string[];
		label: string;
		x: number;
		y: number;
		vx: number;
		vy: number;
	}

	const emailMap = new Map<string, { subject: string; label: string }[]>();
	let { data }: Props = $props();
	let totalUnreadEmails = $state(0);

	emails.forEach((email) => {
		const name = getSenderName(email.from);
		const subject = email.subject.toUpperCase();
		const label = email.label?.[0] ?? 'Unknown'; // fallback in case label is missing

		if (!emailMap.has(name)) {
			emailMap.set(name, []);
		}

		emailMap.get(name).push({ subject, label });
		totalUnreadEmails++;
	});

	let folders: Writable<MovingFolder[]> = writable([]);

	folders.set(
		Array.from(emailMap.entries()).map(([sender, emails]) => ({
			sender,
			subjects: emails.map((e) => e.subject),
			label: emails[0]?.label ?? 'Unknown', // grab the first label
			x: 5 + Math.random() * 85,
			y: Math.random() * 90,
			vx: (Math.random() - 0.5) * 0.15,
			vy: (Math.random() - 0.5) * 0.2
		}))
	);

	let clicked = $state(Array($folders.length).fill(false));
	let active = $state(Array($folders.length).fill(true));

	onMount(async () => {
		async function animate() {
			requestAnimationFrame(animate);
			folders.update((items) =>
				items.map((folder, index) => {
					let { x, y, vx, vy } = folder;

					if (x < 0 || x >= 85) vx *= -1;
					if (y < 0 || y >= 90) vy *= -1;

					x += vx;
					y += vy;

					return { ...folder, x, y, vx, vy };
				})
			);
		}

		await animate();
		await tick();
	});
</script>

<div class="relative h-full w-full text-lg text-white">
	{#each $folders as entry, i}
		<div
			class="absolute"
			style={`left: ${entry.x}%; top: ${entry.y}%`}
			role="presentation"
			onclick={() => {
				// if (active[i]) {
				clicked[i] = !clicked[i];
				if (clicked[i]) {
					totalUnreadEmails -= entry.subjects.length;
				}
				// setTimeout(() => {
				// 	active[i] = false;
				// }, 5000);
				// }
				tick();
			}}
		>
			<Folder
				sender={entry.sender}
				subjects={entry.subjects}
				category={entry.label}
				isClicked={clicked[i]}
				isActive={active[i]}
			/>
		</div>
	{/each}
	<div class="absolute right-0 top-0 px-1 py-0.5 text-2xl uppercase text-white">
		UNREAD: {totalUnreadEmails}
		{#if totalUnreadEmails > 400}
			!!!
		{:else if totalUnreadEmails > 200}
			:///
		{:else}
			:)))
		{/if}
	</div>
</div>
