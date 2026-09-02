<script>
	// Écran 6/9 des wireframes : Dépôt d'une annonce (US05, US06)
	// — voir docs/conception/troctroc-wireframes.md §2.3
	//
	// En-tête "visiteur" par défaut (comme le reste du site) plutôt que la variante "connectée" du
	// wireframe : il n'y a pas encore de session utilisateur (voir /connexion, non implémentée), donc
	// rien à afficher côté avatar/messagerie pour l'instant.

	import { onDestroy } from 'svelte';
	import { categories } from '$lib/annonces.js';
	import ThemeToggle from '$lib/ThemeToggle.svelte';
	import logo from '$lib/assets/logo-mobile.png';

	let titre = $state('');
	let description = $state('');
	let prix = $state('');
	let categorie = $state('');

	/** @type {{ id: number, fichier: File, url: string }[]} */
	let photos = $state([]);
	let glisseActif = $state(false);
	let prochainId = 1;

	/** @param {FileList | null} fichiers */
	function ajouterPhotos(fichiers) {
		if (!fichiers) return;
		for (const fichier of fichiers) {
			if (!fichier.type.startsWith('image/')) continue;
			// URL.createObjectURL : aperçu local immédiat, sans backend (POST /annonces/:id/photos
			// n'existe pas encore, voir docs/conception/troctroc-endpoints.md).
			photos = [...photos, { id: prochainId++, fichier, url: URL.createObjectURL(fichier) }];
		}
	}

	/** @param {DragEvent} event */
	function onDrop(event) {
		event.preventDefault();
		glisseActif = false;
		ajouterPhotos(event.dataTransfer?.files ?? null);
	}

	/** @param {Event & { currentTarget: HTMLInputElement }} event */
	function onChoixFichiers(event) {
		ajouterPhotos(event.currentTarget.files);
		event.currentTarget.value = '';
	}

	/** @param {number} id */
	function retirerPhoto(id) {
		const photo = photos.find((p) => p.id === id);
		if (photo) URL.revokeObjectURL(photo.url);
		photos = photos.filter((p) => p.id !== id);
	}

	// Les URL objet créées par URL.createObjectURL ne sont jamais libérées automatiquement :
	// sans ça, changer de photo (ou quitter la page) fuit de la mémoire tant que l'onglet reste ouvert.
	onDestroy(() => {
		for (const photo of photos) URL.revokeObjectURL(photo.url);
	});

	/** @param {SubmitEvent} event */
	function onPublier(event) {
		event.preventDefault();
		// Pas encore de POST /annonces côté backend : validation client uniquement pour l'instant.
		console.log('[dépôt annonce] publier', {
			titre,
			description,
			prix,
			categorie,
			photos: photos.map((p) => p.fichier.name)
		});
	}
</script>

<svelte:head>
	<title>TrocTroc — Déposer une annonce</title>
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

<main class="deposer-main">
	<h1>Déposer une annonce</h1>

	<form class="deposer-form" onsubmit={onPublier}>
		<label>
			Titre de l'annonce
			<input type="text" name="titre" required maxlength="100" bind:value={titre} />
		</label>

		<label>
			Description
			<textarea name="description" required bind:value={description}></textarea>
		</label>

		<div class="deposer-row">
			<label>
				Prix
				<div class="deposer-prix">
					<input type="number" name="prix" required min="0" step="0.01" bind:value={prix} />
					<span>€</span>
				</div>
			</label>

			<label>
				Catégorie
				<select name="categorie" required bind:value={categorie}>
					<option value="" disabled selected>Choisir une catégorie</option>
					{#each categories as categorieDisponible (categorieDisponible)}
						<option value={categorieDisponible}>{categorieDisponible}</option>
					{/each}
				</select>
			</label>
		</div>

		<div>
			<span class="deposer-label-photos">Photos</span>

			<label
				class="upload-zone"
				class:glisse-actif={glisseActif}
				ondragover={(event) => {
					event.preventDefault();
					glisseActif = true;
				}}
				ondragleave={() => (glisseActif = false)}
				ondrop={onDrop}
			>
				<input type="file" accept="image/*" multiple hidden onchange={onChoixFichiers} />
				Glissez vos photos ici ou cliquez pour parcourir
			</label>

			{#if photos.length > 0}
				<ul class="upload-vignettes">
					{#each photos as photo (photo.id)}
						<li>
							<img src={photo.url} alt="" />
							<button
								type="button"
								onclick={() => retirerPhoto(photo.id)}
								aria-label="Retirer la photo {photo.fichier.name}"
							>
								&times;
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<div class="deposer-actions">
			<a href="/" class="button-text">Annuler</a>
			<button type="submit" class="button-primary">Publier</button>
		</div>
	</form>
</main>

<footer class="site-footer">
	<p>© TrocTroc</p>
	<nav aria-label="Liens du pied de page">
		<a href="/a-propos">À propos</a>
		<a href="/cgu">CGU</a>
		<a href="/contact">Contact</a>
	</nav>
</footer>
