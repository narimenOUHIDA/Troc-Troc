<script>
	// Carte annonce réutilisée par l'accueil, la liste (/annonces) et les "annonces similaires"
	// (/annonces/[id]). Au survol (souris) ou à l'appui (tactile), les photos de l'annonce défilent
	// automatiquement — simple rotation du `src` sur un intervalle plutôt qu'un vrai carrousel à
	// plusieurs calques : suffisant pour un défilement automatique (pas de swipe manuel demandé).

	import { onDestroy } from 'svelte';
	import photoPlaceholder from '$lib/assets/annonce-placeholder.png';

	/**
	 * @typedef {{ id: number, titre: string, prix: number, distanceKm: number, categorie: string,
	 *   statut: string, photos?: string[] }} Annonce
	 */
	/** @type {{ annonce: Annonce }} */
	let { annonce } = $props();

	let photos = $derived(annonce.photos?.length ? annonce.photos : [photoPlaceholder]);

	let indexPhoto = $state(0);
	/** @type {ReturnType<typeof setInterval> | undefined} */
	let intervalle;

	function demarrerDefilement() {
		if (photos.length < 2 || intervalle) return;
		intervalle = setInterval(() => {
			indexPhoto = (indexPhoto + 1) % photos.length;
		}, 1200);
	}

	function arreterDefilement() {
		clearInterval(intervalle);
		intervalle = undefined;
		indexPhoto = 0;
	}

	onDestroy(() => clearInterval(intervalle));
</script>

<li class="annonce-card">
	<a
		href="/annonces/{annonce.id}"
		onmouseenter={demarrerDefilement}
		onmouseleave={arreterDefilement}
		ontouchstart={demarrerDefilement}
		ontouchend={arreterDefilement}
		ontouchcancel={arreterDefilement}
	>
		<div class="annonce-photo" aria-hidden="true">
			<img src={photos[indexPhoto]} alt="" />
			<span class="annonce-badge-categorie">{annonce.categorie}</span>
			{#if annonce.statut === 'vendu'}
				<span class="annonce-badge-vendu">VENDU</span>
			{/if}
			{#if photos.length > 1}
				<div class="annonce-photo-dots">
					{#each photos as _, i (i)}
						<span class="annonce-photo-dot" class:active={i === indexPhoto}></span>
					{/each}
				</div>
			{/if}
		</div>
		<p class="annonce-titre">{annonce.titre}</p>
		<p class="annonce-prix">{annonce.prix} €</p>
		<p class="annonce-distance">{annonce.distanceKm} km</p>
	</a>
</li>
