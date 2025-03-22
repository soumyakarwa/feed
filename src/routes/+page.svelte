<script lang="ts">
	import emails from '$lib/assets/data/emails.json';
	import { getSenderName } from '$lib/util/getSenderName';
	import Folder from '$lib/components/Folder.svelte';
	import { greatest } from 'd3';
	import { tick, onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	interface Props {
		data: any;
	}

	interface MovingFolder {
		sender: string;
		subjects: string[];
		x: number;
		y: number;
		vx: number;
		vy: number;
	}

	const emailMap = new Map();
	let { data }: Props = $props();

	emails.forEach((email) => {
		// Extract name from the "from" field
		const name = getSenderName(email.from);

		if (!emailMap.has(name)) {
			emailMap.set(name, []);
		}

		emailMap.get(name).push(email.subject.toUpperCase());
	});

	let folders: Writable<MovingFolder[]> = writable([]);

	folders.set(
		Array.from(emailMap.entries()).map(([sender, subjects]) => ({
			sender,
			subjects,
			x: 5 + Math.random() * 85,
			y: Math.random() * 90,
			vx: (Math.random() - 0.5) * 0.3,
			vy: (Math.random() - 0.5) * 0.4
		}))
	);

	let folderWidths: number[] = $state([0]);
	let folderHeights: number[] = $state([0]);

	onMount(async () => {
		async function animate() {
			// console.log('in animate');
			requestAnimationFrame(animate);

			folders.update((items) =>
				items.map((folder, index) => {
					let { x, y, vx, vy } = folder;

					if (x < 0 || x > 90) vx *= -1;
					if (y < 0 || y > 80) vy *= -1;

					x += vx;
					y += vy;

					return { ...folder, x, y, vx, vy };
				})
			);
		}

		await animate();
		await tick();
	});

	// $inspect(folderWidths, folderHeights);
</script>

<div class="relative h-full w-full text-lg text-white">
	{#each $folders as entry, i}
		<div
			class="absolute"
			style={`left: ${entry.x}%; top: ${entry.y}%`}
			bind:clientWidth={folderWidths[i]}
			bind:clientHeight={folderHeights[i]}
		>
			<Folder sender={entry.sender} subjects={entry.subjects} />
		</div>
	{/each}
</div>
