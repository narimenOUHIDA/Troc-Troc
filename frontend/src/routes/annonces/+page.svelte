<script>
	// Écran 2/9 des wireframes : Liste des annonces (US07, US08, US09, US10)
	// — voir docs/conception/troctroc-wireframes.md §1.2
	//
	// Demande explicite : pas de CSS dédié pour l'instant. Seules les classes déjà stylées par
	// l'accueil (site-header, site-footer, annonces-grid, annonce-card...) sont réutilisées pour
	// garder les mêmes cartes ; fil d'Ariane, filtres, tri et pagination restent en HTML brut.

	import { page } from '$app/state';
	import ThemeToggle from '$lib/ThemeToggle.svelte';
	import { categories as categoriesDisponibles, annonces as toutesLesAnnonces } from '$lib/annonces.js';
	import photoPlaceholder from '$lib/assets/annonce-placeholder.png';
	import logo from '$lib/assets/logo-mobile.png';

	// Filtres pré-remplis depuis l'URL (tuile catégorie de l'accueil, ou recherche mots-clés/code postal).
	const categorieUrl = page.url.searchParams.get('categorie');
	let recherche = $state(page.url.searchParams.get('q') ?? '');
	let categoriesSelectionnees = $state(categorieUrl ? [categorieUrl] : []);
	let codePostal = $state(page.url.searchParams.get('codePostal') ?? '');
	let rayonKm = $state(50);
	let prixMin = $state('');
	let prixMax = $state('');
	let tri = $state('recent');

	// Pagination alignée sur le wireframe (grille 3 colonnes x 3 lignes = 9 annonces/page).
	let pageCourante = $state(1);
	const parPage = 9;

	/**
	 * Coche/décoche une catégorie dans le filtre (plusieurs catégories peuvent être actives à la fois).
	 * @param {string} categorie
	 */
	function toggleCategorie(categorie) {
		categoriesSelectionnees = categoriesSelectionnees.includes(categorie)
			? categoriesSelectionnees.filter((c) => c !== categorie)
			: [...categoriesSelectionnees, categorie];
	}

	// Redémarre à la page 1 dès qu'un filtre ou le tri change, sinon on pourrait se retrouver
	// sur une page qui n'existe plus après un filtrage plus restrictif.
	$effect(() => {
		categoriesSelectionnees;
		prixMin;
		prixMax;
		recherche;
		tri;
		pageCourante = 1;
	});

	let annoncesFiltrees = $derived(
		toutesLesAnnonces.filter((annonce) => {
			if (categoriesSelectionnees.length > 0 && !categoriesSelectionnees.includes(annonce.categorie)) {
				return false;
			}
			if (recherche.trim() && !annonce.titre.toLowerCase().includes(recherche.trim().toLowerCase())) {
				return false;
			}
			if (prixMin !== '' && annonce.prix < Number(prixMin)) return false;
			if (prixMax !== '' && annonce.prix > Number(prixMax)) return false;
			return true;
		})
	);

	let annoncesTriees = $derived(
		[...annoncesFiltrees].sort((a, b) => {
			if (tri === 'prix-croissant') return a.prix - b.prix;
			if (tri === 'prix-decroissant') return b.prix - a.prix;
			if (tri === 'proximite') return a.distanceKm - b.distanceKm;
			// 'recent' : pas de date_publication en mock, l'ordre du tableau fait office de "plus récent d'abord".
			return 0;
		})
	);

	let nbPages = $derived(Math.max(1, Math.ceil(annoncesTriees.length / parPage)));
	let annoncesPage = $derived(annoncesTriees.slice((pageCourante - 1) * parPage, pageCourante * parPage));
</script>

<svelte:head>
	<title>TrocTroc — Liste des annonces</title>
</svelte:head>

<header class="site-header">
	<a class="logo" href="/"><img src={logo} alt="TrocTroc" /></a>

	<form class="header-search" role="search" onsubmit={(event) => event.preventDefault()}>
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
		/ {recherche ? `Résultats pour « ${recherche} »` : 'Liste des annonces'}
	</nav>

	<div>
		<!-- Panneau de filtres (US08 catégorie, US09 rayon/code postal, US10 prix). -->
		<aside aria-label="Filtres">
			<h2>Filtres</h2>

			<fieldset>
				<legend>Catégorie</legend>
				{#each categoriesDisponibles as categorie (categorie)}
					<label>
						<input
							type="checkbox"
							checked={categoriesSelectionnees.includes(categorie)}
							onchange={() => toggleCategorie(categorie)}
						/>
						{categorie}
					</label>
				{/each}
			</fieldset>

			<fieldset>
				<legend>Code postal</legend>
				<input
					type="text"
					name="codePostal"
					bind:value={codePostal}
					inputmode="numeric"
					maxlength="5"
					placeholder="69003"
				/>
			</fieldset>

			<fieldset>
				<legend>Rayon</legend>
				<input type="range" name="rayon" min="5" max="50" step="5" bind:value={rayonKm} />
				<span>{rayonKm} km</span>
			</fieldset>

			<fieldset>
				<legend>Prix</legend>
				<label>
					Min
					<input type="number" name="prixMin" min="0" bind:value={prixMin} placeholder="Min" />
				</label>
				<label>
					Max
					<input type="number" name="prixMax" min="0" bind:value={prixMax} placeholder="Max" />
				</label>
			</fieldset>
		</aside>

		<!-- Résultats (US07). -->
		<section aria-label="Résultats">
			<div>
				<p>{annoncesTriees.length} annonce{annoncesTriees.length > 1 ? 's' : ''} trouvée{annoncesTriees.length > 1 ? 's' : ''}</p>

				<label>
					Trier par :
					<select bind:value={tri}>
						<option value="recent">Plus récentes</option>
						<option value="prix-croissant">Prix croissant</option>
						<option value="prix-decroissant">Prix décroissant</option>
						<option value="proximite">Proximité</option>
					</select>
				</label>
			</div>

			{#if annoncesPage.length === 0}
				<p>Aucune annonce ne correspond à ces critères.</p>
			{:else}
				<ul class="annonces-grid">
					{#each annoncesPage as annonce (annonce.id)}
						<li class="annonce-card">
							<a href="/annonces/{annonce.id}">
								<div class="annonce-photo" aria-hidden="true">
									<img src={photoPlaceholder} alt="" />
									<span class="annonce-badge-categorie">{annonce.categorie}</span>
									{#if annonce.statut === 'vendu'}
										<span class="annonce-badge-vendu">VENDU</span>
									{/if}
								</div>
								<p class="annonce-titre">{annonce.titre}</p>
								<p class="annonce-prix">{annonce.prix} €</p>
								<p class="annonce-distance">{annonce.distanceKm} km</p>
							</a>
						</li>
					{/each}
				</ul>

				<!-- Pagination : `nbPages` grandit si le mock ou les filtres changent, contrairement au
				     "1 2 3 … 8" figé du wireframe (24 annonces fixes ici, donc jamais > 3 pages en pratique). -->
				<nav aria-label="Pagination">
					<button type="button" disabled={pageCourante === 1} onclick={() => (pageCourante -= 1)}>
						&lsaquo;
					</button>
					{#each Array(nbPages) as _, i (i)}
						<button
							type="button"
							aria-current={pageCourante === i + 1 ? 'page' : undefined}
							onclick={() => (pageCourante = i + 1)}
						>
							{i + 1}
						</button>
					{/each}
					<button type="button" disabled={pageCourante === nbPages} onclick={() => (pageCourante += 1)}>
						&rsaquo;
					</button>
				</nav>
			{/if}
		</section>
	</div>
</main>

<footer class="site-footer">
	<p>© TrocTroc</p>
	<nav aria-label="Liens du pied de page">
		<a href="/a-propos">À propos</a>
		<a href="/cgu">CGU</a>
		<a href="/contact">Contact</a>
	</nav>
</footer>
