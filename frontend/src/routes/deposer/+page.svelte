<script>
  import Header from '$lib/Header.svelte';
  import { onMount } from 'svelte';
  import api from '$lib/api.js';
  import apiPhoto from '$lib/apiPhoto.js';
  import { goto } from '$app/navigation';

  let error = $state('');

  let title = $state('');
  let description = $state('');
  let price = $state('');
  let categoryId = $state();

  let categories = $state([]);

  let submitError = $state('');

  onMount(async () => {
    try {
      categories = await api('/categories');
    } catch (e) {
      error = e.message;
    }
  });

  let selectedFile = $state(null);

  function onChoixFichier(event) {
    selectedFile = event.currentTarget.files[0];
  }

  async function onPublier(event) {
    event.preventDefault();
    submitError = '';

    try {
      const listing = await api('/api/v1/annonces', 'POST', {
        title,
        description,
        price: Number(price),
        categoryId: Number(categoryId),
      });

      // 2. Upload des photos, une fois l'annonce créée
      if (selectedFile) {
        await apiPhoto(listing.id, selectedFile, 1);
      }

      goto('/dashboard');
    } catch (e) {
      submitError = e.message;
    }
  }
</script>

<svelte:head>
  <title>TrocTroc — Déposer une annonce</title>
</svelte:head>

<Header />

<main class="deposer-main">
  <h1>Déposer une annonce</h1>
  <p class="deposer-lead">Renseignez les informations de votre article pour le mettre en ligne.</p>

  <form class="deposer-form" onsubmit={onPublier} enctype="multipart/form-data">
    <h1>Déposer une annonce</h1>

    <div class="form-group">
      <label>
        Photos
        <input
          type="file"
          class="form-control-file"
          name="uploaded_file"
          accept="image/*"
          onchange={onChoixFichier}
        />
      </label>
    </div>

    <label>
      Titre de l'annonce
      <input type="text" name="titre" required maxlength="100" bind:value={title} />
    </label>

    <label>
      Description
      <textarea name="description" required bind:value={description}></textarea>
    </label>

    <div class="deposer-row">
      <label>
        Prix
        <div class="deposer-prix">
          <input type="number" name="prix" required min="0" step="0.01" bind:value={price} />
          <span>€</span>
        </div>
      </label>

      <label>
        Catégorie

        <select name="categorie" required bind:value={categoryId}>
          <option value="">Choisir une catégorie</option>
          {#each categories as categorie (categorie.id)}
            <option value={categorie.id}>{categorie.name}</option>
          {/each}
        </select>
      </label>
    </div>

    <div>
      <span class="deposer-label-photos">Photos</span>
    </div>

    {#if submitError}
      <p class="error">{submitError}</p>
    {/if}

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
