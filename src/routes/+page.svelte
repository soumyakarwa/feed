<script lang="ts">
	interface Props {
		data: any;
	}

	let { data }: Props = $props();
</script>

<h1>Latest Email</h1>
{#if data.email}
	<p><strong>From:</strong> {data.email.from}</p>
	<p><strong>Subject:</strong> {data.email.subject}</p>
{:else}
	<p>No recent emails found.</p>
{/if}
