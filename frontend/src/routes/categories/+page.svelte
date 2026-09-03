<script>
	// Page Catégories : jusqu'ici seule la tuile "Catégories" du header y renvoyait (lien mort,
	// cf. docs/carnet-de-bord.md, 02/09). Liste toutes les catégories (US09) avec le nombre
	// d'annonces par catégorie ; chaque tuile mène vers /annonces filtrée, comme depuis l'accueil.

	import ThemeToggle from '$lib/ThemeToggle.svelte';
	import { categories, annonces } from '$lib/annonces.js';
	import logo from '$lib/assets/logo-mobile.png';

	let recherche = $state('');

	/**
	 * @param {SubmitEvent} event
	 */
	function onRechercherHeader(event) {
		event.preventDefault();
		console.log('[categories] recherche (header)', { recherche });
	}

	// Nombre d'annonces par catégorie, calculé sur le catalogue mocké (toutes annonces confondues,
	// disponibles ou vendues) en attendant GET /categories (docs/conception/troctroc-endpoints.md).
	let nbAnnoncesParCategorie = $derived(
		Object.fromEntries(
			categories.map((categorie) => [
				categorie,
				annonces.filter((annonce) => annonce.categorie === categorie).length
			])
		)
	);
</script>

<svelte:head>
	<title>TrocTroc — Catégories</title>
</svelte:head>

<header class="site-header">
	<a class="logo" href="/"><img src={logo} alt="TrocTroc" /></a>

	<form class="header-search" role="search" onsubmit={onRechercherHeader}>
		<input
			type="search"
			name="q"
			placeholder="Rechercher un article..."
			aria-label="Rechercher un article"
			bind:value={recherche}
		/>
	</form>

	<nav class="header-nav" aria-label="Navigation principale">
		<a href="/categories">Catégories</a>
		<a href="/deposer">Déposer une annonce</a>
		<a href="/messages">Messagerie</a>
	</nav>

	<div class="header-auth">
		<ThemeToggle />
		<a href="/connexion">Connexion</a>
		<a class="button-primary" href="/inscription">S'inscrire</a>
	</div>
</header>

<main>
	<nav aria-label="Fil d'Ariane">
		<a href="/">Accueil</a>
		/ Catégories
	</nav>

	<section class="categories">
		<h2>Toutes les catégories</h2>
		<ul class="categories-grid">
			{#each categories as categorie (categorie)}
				<li>
					<a href="/annonces?categorie={encodeURIComponent(categorie)}">
						{categorie}
						<br />
						<small>{nbAnnoncesParCategorie[categorie]} annonce{nbAnnoncesParCategorie[categorie] > 1 ? 's' : ''}</small>
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
