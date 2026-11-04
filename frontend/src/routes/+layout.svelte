<script>
  import { onMount } from 'svelte';
  import { getAuth } from '$lib/store/auth.svelte.js';
  import '../app.css';
  import favicon from '$lib/assets/favicon.png';

  let { children } = $props();

  onMount(() => {
    getAuth();
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
