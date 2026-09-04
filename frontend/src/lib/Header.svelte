<script>
	// En-tête du site, deux variantes selon docs/conception/charte (1).pdf §"La navigation" :
	// "Header desktop — visiteur (non connecté)" et "Header desktop — utilisateur connecté".
	// Il n'y a pas encore de session utilisateur côté frontend (voir /connexion, non implémentée),
	// donc toutes les pages passent `connecte={false}` pour l'instant ; ce composant existe pour que
	// le jour où une vraie session existera, il suffise de passer `connecte={true}` (+ les compteurs).
	//
	// Le tiroir mobile (hamburger) de la charte n'est pas repris ici : le header reste sur le même
	// empilement mobile-first (flex-wrap) que le reste du site plutôt que d'introduire un nouveau
	// pattern d'interaction.

	import ThemeToggle from '$lib/ThemeToggle.svelte';
	import Logo from '$lib/Logo.svelte';

	let { connecte = false, initiales = 'MC', nbNotifications = 0, nbMessages = 0 } = $props();
</script>

<header class="site-header">
	<a class="logo" href="/"><Logo /></a>

	<form class="header-search" role="search" method="GET" action="/annonces">
		<svg class="header-search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
			<circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5" />
			<line x1="13.5" y1="13.5" x2="18" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
		</svg>
		<input type="search" name="q" placeholder="Rechercher un article..." aria-label="Rechercher un article" />
	</form>

	<nav class="header-nav" aria-label="Navigation principale">
		<a href="/">Accueil</a>
		<a href="/categories">
			Catégories
			{#if connecte}
				<svg class="header-nav-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<polyline points="5 8 10 13 15 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			{/if}
		</a>
		{#if !connecte}
			<a href="/comment-ca-marche">Comment ça marche</a>
		{/if}
	</nav>

	<div class="header-auth">
		<ThemeToggle />

		{#if connecte}
			<a class="button-accent" href="/deposer">+ Déposer une annonce</a>

			<a class="header-icon-link" href="/notifications" aria-label="Notifications">
				<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<path
						d="M5 8a5 5 0 0 1 10 0c0 3 1 4.5 1.5 5H3.5C4 12.5 5 11 5 8Z"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linejoin="round"
					/>
					<path d="M8.2 15.5a1.8 1.8 0 0 0 3.6 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
				</svg>
				{#if nbNotifications > 0}<span class="header-badge">{nbNotifications}</span>{/if}
			</a>

			<a class="header-icon-link" href="/messages" aria-label="Messagerie">
				<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<rect x="2.5" y="4.5" width="15" height="11" rx="1.5" stroke="currentColor" stroke-width="1.5" />
					<path d="m3 5.5 7 5.5 7-5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
				{#if nbMessages > 0}<span class="header-badge">{nbMessages}</span>{/if}
			</a>

			<a class="header-avatar" href="/profil" aria-label="Mon profil">{initiales}</a>
		{:else}
			<a class="button-secondary" href="/connexion">Se connecter</a>
			<a class="button-primary" href="/inscription">S'inscrire</a>
		{/if}
	</div>
</header>
