<script>
	// Écran 1/9 des wireframes : Accueil (US01) — voir docs/conception/troctroc-wireframes.md §1.1

	import ThemeToggle from '$lib/ThemeToggle.svelte';

	// Données statiques en attendant le backend : GET /categories et GET /annonces n'existent pas encore
	// (voir docs/conception/troctroc-endpoints.md). Formes alignées sur le dictionnaire des données
	// (CATEGORIE.nom, ANNONCE.titre/prix) pour limiter les changements quand on branchera `api.js`.
	// `distanceKm` n'existe pas en base : elle serait calculée côté API à partir du code postal de l'utilisateur.
	const categories = [
		'Mobilier',
		'Électroménager',
		'Vêtements',
		'Sport & Loisirs',
		'Multimédia',
		'Enfants & Bébé',
		'Bricolage & Jardin',
		'Véhicules'
	];

	const dernieresAnnonces = [
		{ id: 1, titre: 'Vélo VTT 26 pouces', prix: 45, distanceKm: 3 },
		{ id: 2, titre: 'Canapé 3 places', prix: 120, distanceKm: 6 },
		{ id: 3, titre: 'Console de jeux', prix: 60, distanceKm: 5 },
		{ id: 4, titre: 'Table basse en bois', prix: 30, distanceKm: 9 },
		{ id: 5, titre: 'Perceuse-visseuse', prix: 35, distanceKm: 4 },
		{ id: 6, titre: 'Chaise de bureau', prix: 40, distanceKm: 7 },
		{ id: 7, titre: 'Manteau hiver', prix: 25, distanceKm: 2 },
		{ id: 8, titre: 'Poussette', prix: 55, distanceKm: 8 }
	];

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
						<div class="annonce-photo" aria-hidden="true">photo</div>
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
