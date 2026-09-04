<script>
	// Page Catégories : jusqu'ici seule la tuile "Catégories" du header y renvoyait (lien mort,
	// cf. docs/carnet-de-bord.md, 02/09). Liste toutes les catégories (US09) avec le nombre
	// d'annonces par catégorie ; chaque tuile mène vers /annonces filtrée, comme depuis l'accueil.

	import { categories, annonces } from '$lib/annonces.js';
	import Header from '$lib/Header.svelte';

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

<Header connecte={false} />

<main>
	<nav class="breadcrumb" aria-label="Fil d'Ariane">
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
