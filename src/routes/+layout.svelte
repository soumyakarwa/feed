<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<section class="font-geist h-screen w-screen bg-black">
	{@render children()}
</section>
