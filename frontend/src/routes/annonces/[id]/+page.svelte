<script>
	// Écran 3/9 des wireframes : Détail d'une annonce (US11, US12)
	// — voir docs/conception/troctroc-wireframes.md §1.3

	import { page } from '$app/state';
	import { trouverAnnonce, annoncesSimilaires } from '$lib/annonces.js';
	import photoPlaceholder from '$lib/assets/annonce-placeholder.png';
	import Header from '$lib/Header.svelte';
	import AnnonceCard from '$lib/AnnonceCard.svelte';

	// $derived (pas juste lu une fois) : reste correct si on navigue d'une annonce à une autre sans
	// démonter le composant (ex. clic sur une annonce similaire, SvelteKit réutilise la même page).
	let annonce = $derived(trouverAnnonce(page.params.id));
	let similaires = $derived(annonce ? annoncesSimilaires(annonce) : []);

	// Galerie : photo principale + vignettes cliquables, à partir des vraies photos de l'annonce
	// (au lieu du visuel générique répété 4 fois). Repart sur la première photo à chaque nouvelle
	// annonce (le composant étant réutilisé d'une annonce à l'autre, voir le commentaire ci-dessus).
	let photos = $derived(annonce?.photos?.length ? annonce.photos : [photoPlaceholder]);
	let indexPhotoActive = $state(0);

	$effect(() => {
		annonce?.id;
		indexPhotoActive = 0;
	});

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

<Header connecte={false} />

<main>
	{#if !annonce}
		<p>Cette annonce n'existe pas ou a été supprimée.</p>
		<a href="/annonces">&larr; Retour à la liste des annonces</a>
	{:else}
		<nav class="breadcrumb" aria-label="Fil d'Ariane">
			<a href="/">Accueil</a>
			/ <a href="/annonces?categorie={encodeURIComponent(annonce.categorie)}">{annonce.categorie}</a>
			/ {annonce.titre}
		</nav>

		<div class="annonce-detail">
			<!-- Colonne gauche : galerie (photo principale + vignettes) et description. -->
			<section aria-label="Photos de l'annonce">
				<div class="annonce-photo" aria-hidden="true"><img src={photos[indexPhotoActive]} alt="" /></div>

				{#if photos.length > 1}
					<ul class="annonce-vignettes">
						{#each photos as photo, i (i)}
							<li>
								<button
									type="button"
									class="annonce-photo annonce-vignette-bouton"
									class:active={i === indexPhotoActive}
									onclick={() => (indexPhotoActive = i)}
									aria-label="Voir la photo {i + 1} sur {photos.length}"
									aria-current={i === indexPhotoActive}
								>
									<img src={photo} alt="" />
								</button>
							</li>
						{/each}
					</ul>
				{/if}

				<h2>Description</h2>
				<p>{annonce.description}</p>
			</section>

			<!-- Colonne droite : infos annonce, encart vendeur, action de contact. -->
			<aside class="annonce-infos" aria-label="Informations sur l'annonce">
				<p class="annonce-infos-categorie">{annonce.categorie}</p>
				<h1>{annonce.titre}</h1>
				<p class="annonce-infos-prix">{annonce.prix} €</p>
				<p class="annonce-infos-meta">{annonce.ville} {annonce.codePostal} · à {annonce.distanceKm} km</p>
				<p class="annonce-infos-meta">Publiée le {formaterDate(annonce.datePublication)}</p>

				{#if annonce.statut === 'vendu'}
					<p class="annonce-infos-vendu"><strong>Vendu</strong></p>
				{/if}

				<div class="annonce-vendeur">
					<p class="annonce-vendeur-nom">{annonce.vendeur.nom}</p>
					<p class="annonce-vendeur-meta">Membre depuis {annonce.vendeur.membreDepuis} · {annonce.vendeur.nbAnnonces} annonces</p>
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
						<AnnonceCard annonce={annonceSimilaire} />
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
