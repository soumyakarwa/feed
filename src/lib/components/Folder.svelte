<script lang="ts">
	import folder from '$lib/assets/images/folder.svg';
	import { scaleLinear } from 'd3';

	interface Props {
		sender: string;
		subjects: string[];
	}

	let { sender, subjects } = $props();

	const imgSizeScale = scaleLinear().domain([0, 18]).range([100, 250]);

	let clicked = $state(false);

	let positions = (() => {
		const count = subjects.length;
		const radius = imgSizeScale(subjects.length) * 0.25;
		const angleStep = -Math.PI / count - 1;

		const randomAngle = Math.random() * 2 * Math.PI;

		return subjects.map((d: string, i: number) => {
			const angle = randomAngle + i * angleStep;
			const x = 50 + radius * Math.cos(angle); // center at 50%
			const y = 50 + radius * Math.sin(angle);
			return { x, y };
		});
	})();
</script>

<div
	class={['relative cursor-pointer', clicked ? 'z-10' : 'z-5']}
	role="presentation"
	onclick={() => {
		clicked = !clicked;
	}}
>
	<img src={folder} alt="Mac Folder Icon" width={imgSizeScale(subjects.length)} />
	<div
		class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/4 break-words break-all text-center text-xs uppercase text-white"
		style={`width: ${imgSizeScale(subjects.length)}`}
	>
		{sender}
	</div>
	{#each subjects as subject, i}
		<div
			class={[
				'absolute left-1/2 top-1/2 inline-block max-w-20 -translate-x-1/2 -translate-y-1/4 bg-white p-0.5 text-xs text-black opacity-0',
				clicked ? 'animate-springy-bounce-forwards opacity-100' : 'opacity-0'
			]}
			style={clicked
				? `left: ${positions[i]?.x}%; top: ${positions[i]?.y}%;`
				: `left: 25%; top: 25%; opacity:0`}
		>
			<p>{subject}</p>
		</div>
	{/each}
</div>
