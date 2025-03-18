<script lang="ts">
	interface Props {
		data: any;
	}

	let { data }: Props = $props();
	$inspect(data.emails);
</script>

<div class="w-max-content grid grid-cols-3 gap-6">
	{#each data.emails as email}
		<div class="flex flex-col gap-1">
			<p><strong>From:</strong> {email.from}</p>
			<p><strong>Subject:</strong> {email.subject}</p>
			<p><strong>Time</strong> {email.receivedTime}</p>
			<p><strong>Label</strong> {email.label[0]}</p>
		</div>
	{/each}
</div>
