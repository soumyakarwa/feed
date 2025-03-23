<script lang="ts">
	import folderUnread from '$lib/assets/images/folder-unread.svg';
	import folderPromotions from '$lib/assets/images/folder-promotions.svg';
	import { scaleLinear } from 'd3';

	interface Props {
		sender: string;
		subjects: string[];
		category: 'UNREAD' | 'CATEGORY_PROMOTIONS' | string;
		isClicked: boolean;
	}

	let { sender, subjects, category, isClicked }: Props = $props();

	const imgRange = [75, 250];
	const titleSizeRange = [0.5, 1.2];
	const subjectSizeRange = [0.5, 1];
	const imgSizeScale = scaleLinear().domain([0, 18]).range(imgRange);
	const fontSizeScale = scaleLinear().domain(imgRange).range(titleSizeRange);
	const subjectFontSizeScale = scaleLinear().domain(titleSizeRange).range(subjectSizeRange);

	let positions = (() => {
		const count = subjects.length;
		const radius = imgSizeScale(subjects.length) * 0.4;
		const angleStep = (-2 * Math.PI) / count - 1;

		const randomAngle = Math.random() * 2 * Math.PI;

		return subjects.map((d: string, i: number) => {
			const angle = randomAngle + i * angleStep;
			const x = 50 + radius * Math.cos(angle);
			const y = 50 + radius * Math.sin(angle);
			return { x, y };
		});
	})();
</script>

<div class={['relative cursor-pointer', isClicked ? 'z-10' : 'z-5']} role="presentation">
	<img
		src={category == 'CATEGORY_PROMOTIONS' ? folderPromotions : folderUnread}
		alt="Mac Folder Icon"
		width={imgSizeScale(subjects.length)}
	/>
	<div
		class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/4 break-words break-all text-center uppercase leading-none text-white"
		style={`width: ${imgSizeScale(subjects.length)}px; font-size:${fontSizeScale(imgSizeScale(subjects.length))}rem`}
	>
		{sender}
	</div>
	{#each subjects as subject, i}
		<div
			class={[
				'absolute left-1/2 top-1/2 inline-block max-w-20 -translate-x-1/2 -translate-y-1/2 break-words bg-white p-1 leading-none text-black opacity-0',
				isClicked ? 'animate-springy-bounce-forwards opacity-100' : 'opacity-0'
			]}
			style={`
				left: ${isClicked ? positions[i]?.x : 25}%;
				top: ${isClicked ? positions[i]?.y : 25}%;
				opacity: ${isClicked ? 1 : 0};
				font-size: ${subjectFontSizeScale(fontSizeScale(imgSizeScale(subjects.length)))}rem;
			`}
		>
			<p>{subject}</p>
		</div>
	{/each}
</div>
