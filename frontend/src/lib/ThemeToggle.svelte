<script>
	// Bouton slide clair/sombre, affiché dans l'en-tête de chaque page (voir app.css §Thème et
	// le script anti-flash dans app.html). document.documentElement.dataset.theme est la source
	// de vérité (lue par app.css via :root[data-theme]) ; `theme` ici n'en est qu'un miroir local
	// pour l'affichage du curseur.

	import { onMount } from 'svelte';

	// Clair par défaut (charte graphique, docs/conception/charte (1).pdf), sombre en extension.
	let theme = $state('light');

	onMount(() => {
		// Reflète l'état déjà posé par le script anti-flash de app.html (ou, à défaut, le thème
		// système via prefers-color-scheme, que data-theme ne porte pas explicitement — voir app.css).
		theme =
			document.documentElement.dataset.theme === 'light'
				? 'light'
				: document.documentElement.dataset.theme === 'dark'
					? 'dark'
					: window.matchMedia('(prefers-color-scheme: dark)').matches
						? 'dark'
						: 'light';
	});

	function basculerTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('theme', theme);
		} catch (error) {
			// localStorage indisponible : le choix ne survivra pas à un rechargement, tant pis.
		}
	}
</script>

<button
	type="button"
	class="theme-toggle"
	role="switch"
	aria-checked={theme === 'light'}
	aria-label="Basculer entre le mode sombre et le mode clair"
	onclick={basculerTheme}
>
	<span class="theme-toggle-track">
		<span class="theme-toggle-thumb" aria-hidden="true">{theme === 'dark' ? '🌙' : '☀️'}</span>
	</span>
</button>
