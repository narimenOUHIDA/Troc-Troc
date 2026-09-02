<script>
	// Écran 3/9 des wireframes : Détail d'une annonce (US11, US12)
	// — voir docs/conception/troctroc-wireframes.md §1.3
	//
	// Même choix que /annonces : pas de CSS dédié pour l'instant. Galerie et annonces similaires
	// réutilisent les classes déjà stylées (annonce-card, annonce-photo...) ; le reste (fil d'Ariane,
	// colonne infos, encart vendeur) reste en HTML brut.

	import { page } from '$app/state';
	import { trouverAnnonce, annoncesSimilaires } from '$lib/annonces.js';
	import ThemeToggle from '$lib/ThemeToggle.svelte';
	import photoPlaceholder from '$lib/assets/annonce-placeholder.png';
	import logo from '$lib/assets/logo-mobile.png';

	// $derived (pas juste lu une fois) : reste correct si on navigue d'une annonce à une autre sans
	// démonter le composant (ex. clic sur une annonce similaire, SvelteKit réutilise la même page).
	let annonce = $derived(trouverAnnonce(page.params.id));
	let similaires = $derived(annonce ? annoncesSimilaires(annonce) : []);

	const formateurDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

	/**
	 * @param {string} dateIso
	 */
	function formaterDate(dateIso) {
		return formateurDate.format(new Date(dateIso));
	}

	/**
	 * Pas encore de POST /conversations côté backend (messagerie US13-17 à venir) : on trace
	 * seulement l'intention pour l'instant.
	 * @param {MouseEvent} event
	 */
	function onContacter(event) {
		event.preventDefault();
		console.log('[détail annonce] contacter le vendeur', annonce?.vendeur.nom);
	}
</script>

<svelte:head>
	<title>{annonce ? `TrocTroc — ${annonce.titre}` : 'TrocTroc — Annonce introuvable'}</title>
</svelte:head>

<header class="site-header">
	<a class="logo" href="/"><img src={logo} alt="TrocTroc" /></a>

	<form class="header-search" role="search" onsubmit={(event) => event.preventDefault()}>
		<input type="search" name="q" placeholder="Rechercher un article..." aria-label="Rechercher un article" />
	</form>

	<nav class="header-nav" aria-label="Navigation principale">
		<a href="/categories">Catégories</a>
		<a href="/deposer">Déposer une annonce</a>
	</nav>

	<div class="header-auth">
		<ThemeToggle />
		<a href="/connexion">Connexion</a>
		<a class="button-primary" href="/inscription">S'inscrire</a>
	</div>
</header>

<main>
	{#if !annonce}
		<p>Cette annonce n'existe pas ou a été supprimée.</p>
		<a href="/annonces">&larr; Retour à la liste des annonces</a>
	{:else}
		<nav aria-label="Fil d'Ariane">
			<a href="/">Accueil</a>
			/ <a href="/annonces?categorie={encodeURIComponent(annonce.categorie)}">{annonce.categorie}</a>
			/ {annonce.titre}
		</nav>

		<div class="annonce-detail">
			<!-- Colonne gauche : galerie (photo principale + vignettes) et description. -->
			<section aria-label="Photos de l'annonce">
				<div class="annonce-photo" aria-hidden="true"><img src={photoPlaceholder} alt="" /></div>

				<ul class="annonce-vignettes">
					{#each Array(4) as _, i (i)}
						<li class="annonce-photo" aria-hidden="true"><img src={photoPlaceholder} alt="" /></li>
					{/each}
				</ul>

				<h2>Description</h2>
				<p>{annonce.description}</p>
			</section>

			<!-- Colonne droite : infos annonce, encart vendeur, action de contact. -->
			<aside aria-label="Informations sur l'annonce">
				<p>{annonce.categorie}</p>
				<h1>{annonce.titre}</h1>
				<p>{annonce.prix} €</p>
				<p>{annonce.ville} {annonce.codePostal} · à {annonce.distanceKm} km</p>
				<p>Publiée le {formaterDate(annonce.datePublication)}</p>

				{#if annonce.statut === 'vendu'}
					<p><strong>Vendu</strong></p>
				{/if}

				<div>
					<p>{annonce.vendeur.nom}</p>
					<p>Membre depuis {annonce.vendeur.membreDepuis} · {annonce.vendeur.nbAnnonces} annonces</p>
				</div>

				<button
					type="button"
					class="button-primary"
					onclick={onContacter}
					disabled={annonce.statut === 'vendu'}
				>
					{annonce.statut === 'vendu' ? 'Annonce vendue' : 'Contacter le vendeur'}
				</button>
			</aside>
		</div>

		{#if similaires.length > 0}
			<section class="annonces" aria-label="Annonces similaires">
				<h2>Annonces similaires</h2>
				<ul class="annonces-grid">
					{#each similaires as annonceSimilaire (annonceSimilaire.id)}
						<li class="annonce-card">
							<a href="/annonces/{annonceSimilaire.id}">
								<div class="annonce-photo" aria-hidden="true">
									<img src={photoPlaceholder} alt="" />
									<span class="annonce-badge-categorie">{annonceSimilaire.categorie}</span>
									{#if annonceSimilaire.statut === 'vendu'}
										<span class="annonce-badge-vendu">VENDU</span>
									{/if}
								</div>
								<p class="annonce-titre">{annonceSimilaire.titre}</p>
								<p class="annonce-prix">{annonceSimilaire.prix} €</p>
								<p class="annonce-distance">{annonceSimilaire.distanceKm} km</p>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	{/if}
</main>

<footer class="site-footer">
	<p>© TrocTroc</p>
	<nav aria-label="Liens du pied de page">
		<a href="/a-propos">À propos</a>
		<a href="/cgu">CGU</a>
		<a href="/contact">Contact</a>
	</nav>
</footer>
