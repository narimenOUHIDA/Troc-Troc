<script>
	// Écran 1/9 des wireframes : Accueil (US01) — voir docs/conception/troctroc-wireframes.md §1.1

	import ThemeToggle from '$lib/ThemeToggle.svelte';
	import { categories, trouverAnnonce } from '$lib/annonces.js';
	import photoPlaceholder from '$lib/assets/annonce-placeholder.png';

	// Données statiques en attendant le backend : GET /categories et GET /annonces n'existent pas encore
	// (voir docs/conception/troctroc-endpoints.md). Le catalogue complet vit dans $lib/annonces.js,
	// partagé avec /annonces et /annonces/[id] pour que les mêmes id renvoient à la même annonce partout.
	// Sélection des 8 mêmes annonces qu'avant la centralisation (diversité des catégories affichées).
	const idsDernieresAnnonces = [1, 4, 7, 5, 10, 6, 13, 16];
	const dernieresAnnonces = idsDernieresAnnonces.map((id) => trouverAnnonce(id));

	// Champs du formulaire de recherche du bloc d'accroche (hero), liés avec bind:value.
	let recherche = $state('');
	let codePostal = $state('');

	// Champ de la barre de recherche du header (présente sur tout le site, cf. app.css .header-search).
	let rechercheHeader = $state('');

	/**
	 * Recherche du bloc d'accroche (mots-clés + code postal).
	 * Empêche le rechargement natif du formulaire tant qu'il n'y a pas de route /annonces à interroger.
	 * @param {SubmitEvent} event
	 */
	function onRechercher(event) {
		event.preventDefault();
		// Placeholder en attendant la route /annonces (recherche + filtre géographique) et la navigation vers /annonces.
		console.log('[accueil] recherche (hero)', { recherche, codePostal });
	}

	/**
	 * Recherche rapide du header (mots-clés seuls, pas de code postal).
	 * Sans ce handler, la soumission du formulaire déclencherait un GET natif vers la page courante
	 * (rechargement complet) puisque le <form> n'a pas d'attribut action.
	 * @param {SubmitEvent} event
	 */
	function onRechercherHeader(event) {
		event.preventDefault();
		console.log('[accueil] recherche (header)', { rechercheHeader });
	}
</script>

<svelte:head>
	<title>TrocTroc — Achetez, vendez et échangez près de chez vous</title>
</svelte:head>

<!-- En-tête variante visiteur (pas encore de gestion de session) : recherche rapide + Connexion/S'inscrire.
     Les variantes "connecté" et "minimal" (voir §Éléments transverses du wireframe) arriveront avec les
     pages Dépôt/Espace personnel et Connexion/Inscription. -->
<header class="site-header">
	<a class="logo" href="/">TT TrocTroc</a>

	<form class="header-search" role="search" onsubmit={onRechercherHeader}>
		<input
			type="search"
			name="q"
			placeholder="Rechercher un article..."
			aria-label="Rechercher un article"
			bind:value={rechercheHeader}
		/>
	</form>

	<nav class="header-nav" aria-label="Navigation principale">
		<a href="/categories">Catégories</a>
	</nav>

	<div class="header-auth">
		<ThemeToggle />
		<a href="/connexion">Connexion</a>
		<a class="button-primary" href="/inscription">S'inscrire</a>
	</div>
</header>

<main>
	<!-- Bloc d'accroche : recherche "complète" (mots-clés + code postal) qui alimentera GET /annonces
	     avec les paramètres q/postalCode (voir docs/conception/troctroc-endpoints.md). -->
	<section class="hero">
		<h1>Achetez, vendez et échangez près de chez vous</h1>

		<form class="hero-search" onsubmit={onRechercher}>
			<input
				type="text"
				name="q"
				placeholder="Ex. vélo, canapé, console..."
				aria-label="Mots-clés"
				bind:value={recherche}
			/>
			<input
				type="text"
				name="codePostal"
				placeholder="Code postal"
				aria-label="Code postal"
				inputmode="numeric"
				maxlength="5"
				bind:value={codePostal}
			/>
			<button type="submit">Rechercher</button>
		</form>
	</section>

	<!-- Grille des 8 catégories (US09) : chaque tuile pré-filtre la liste des annonces. -->
	<section class="categories">
		<h2>Catégories</h2>
		<ul class="categories-grid">
			{#each categories as categorie (categorie)}
				<li>
					<a href="/annonces?categorie={encodeURIComponent(categorie)}">{categorie}</a>
				</li>
			{/each}
		</ul>
	</section>

	<!-- Grille des dernières annonces publiées (US01) : chaque carte mène au détail (écran 1.3). -->
	<section class="annonces">
		<h2>Dernières annonces</h2>
		<ul class="annonces-grid">
			{#each dernieresAnnonces as annonce (annonce.id)}
				<li class="annonce-card">
					<a href="/annonces/{annonce.id}">
						<div class="annonce-photo" aria-hidden="true"><img src={photoPlaceholder} alt="" /></div>
						<p class="annonce-titre">{annonce.titre}</p>
						<p class="annonce-prix">{annonce.prix} €</p>
						<p class="annonce-distance">{annonce.distanceKm} km</p>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</main>

<footer class="site-footer">
	<p>© TrocTroc</p>
	<nav aria-label="Liens du pied de page">
		<a href="/a-propos">À propos</a>
		<a href="/cgu">CGU</a>
		<a href="/contact">Contact</a>
	</nav>
</footer>
