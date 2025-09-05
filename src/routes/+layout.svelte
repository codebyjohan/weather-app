<script>
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/stylesheets/stylesheets.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"
	/>
	<title>Weather App</title>
</svelte:head>

{@render children?.()}
