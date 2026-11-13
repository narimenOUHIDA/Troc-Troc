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
  let submitting = $state(false);

  onMount(async () => {
    try {
      categories = await api('/categories');
    } catch (e) {
      error = e.message;
    }
  });

  let selectedFile = $state(null);
  let previewUrl = $state(null);
  let glisseActif = $state(false);

  /** @param {File} file */
  function definirFichier(file) {
    if (!file || !file.type.startsWith('image/')) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    selectedFile = file;
    previewUrl = URL.createObjectURL(file);
  }

  function onChoixFichier(event) {
    const fichier = event.currentTarget.files?.[0];
    if (fichier) definirFichier(fichier);
  }

  function onDrop(event) {
    event.preventDefault();
    glisseActif = false;
    const fichier = event.dataTransfer?.files?.[0];
    if (fichier) definirFichier(fichier);
  }

  function retirerPhoto() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    selectedFile = null;
    previewUrl = null;
  }

  async function onPublier(event) {
    event.preventDefault();
    submitError = '';
    submitting = true;

    try {
      const listing = await api('/api/v1/annonces', 'POST', {
        title,
        description,
        price: Number(price),
        categoryId: Number(categoryId),
      });

      if (selectedFile) {
        await apiPhoto(listing.id, selectedFile, 1);
      }

      goto('/dashboard');
    } catch (e) {
      submitError = e.message;
    } finally {
      submitting = false;
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

  <form class="deposer-form" onsubmit={onPublier}>
    <div class="champ-groupe">
      <span class="deposer-label">Photo</span>
      <p class="deposer-hint">Ajoutez une photo pour rendre votre annonce plus attractive.</p>

      {#if previewUrl}
        <div class="upload-vignette">
          <img src={previewUrl} alt="Aperçu de la photo sélectionnée" />
          <button
            type="button"
            class="bouton-retirer"
            onclick={retirerPhoto}
            aria-label="Retirer la photo"
          >
            &times;
          </button>
        </div>
      {:else}
        <label
          class="upload-zone"
          class:glisse-actif={glisseActif}
          ondragover={(e) => {
            e.preventDefault();
            glisseActif = true;
          }}
          ondragleave={() => (glisseActif = false)}
          ondrop={onDrop}
        >
          <input type="file" accept="image/*" hidden onchange={onChoixFichier} />
          <span class="upload-plus">+</span>
          <span class="upload-texte">Glissez une photo ici</span>
          <span class="upload-sous-texte">ou cliquez pour parcourir</span>
        </label>
      {/if}
    </div>

    <label class="champ-groupe">
      <span class="deposer-label">Titre de l'annonce</span>
      <input type="text" name="titre" required maxlength="100" bind:value={title} />
    </label>

    <label class="champ-groupe">
      <span class="deposer-label">Description</span>
      <textarea name="description" required bind:value={description}></textarea>
    </label>

    <div class="deposer-row">
      <label class="champ-groupe">
        <span class="deposer-label">Prix</span>
        <div class="deposer-prix">
          <input type="number" name="prix" required min="0" step="0.01" bind:value={price} />
          <span>€</span>
        </div>
      </label>

      <label class="champ-groupe">
        <span class="deposer-label">Catégorie</span>
        <select name="categorie" required bind:value={categoryId}>
          <option value="">Choisir une catégorie</option>
          {#each categories as categorie (categorie.id)}
            <option value={categorie.id}>{categorie.name}</option>
          {/each}
        </select>
      </label>
    </div>

    {#if submitError}
      <p class="error">{submitError}</p>
    {/if}

    <div class="deposer-actions">
      <a href="/" class="button-text">Annuler</a>
      <button type="submit" class="button-primary" disabled={submitting}>
        {submitting ? 'Publication...' : 'Publier'}
      </button>
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

<style>
  .deposer-main {
    max-width: 640px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
  }

  .deposer-main h1 {
    font-family: Cambria, Georgia, serif;
    font-size: 1.8rem;
    color: #19352b;
    margin: 0 0 0.4rem;
  }

  .deposer-lead {
    color: #6b6960;
    font-size: 0.9rem;
    margin: 0 0 2rem;
  }

  .deposer-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .champ-groupe {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .deposer-label {
    font-weight: 600;
    font-size: 0.85rem;
    color: #3a3833;
  }

  .deposer-hint {
    font-size: 0.78rem;
    color: #8c897e;
    margin: 0;
  }

  /* --- Zone d'upload --- */
  .upload-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    height: 180px;
    border: 1.5px dashed #e4e1d6;
    border-radius: 16px;
    background: #fff;
    cursor: pointer;
    color: #2f7d5b;
    transition:
      border-color 0.15s ease,
      background 0.15s ease;
  }

  .upload-zone.glisse-actif {
    border-color: #2f7d5b;
    background: #e4f0ea;
  }

  .upload-plus {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #e4f0ea;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
  }

  .upload-texte {
    font-size: 0.9rem;
    font-weight: 600;
    color: #19352b;
  }

  .upload-sous-texte {
    font-size: 0.78rem;
    color: #8c897e;
  }

  .upload-vignette {
    position: relative;
    height: 220px;
    border-radius: 16px;
    overflow: hidden;
    border: 1.5px solid #e4e1d6;
  }

  .upload-vignette img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .bouton-retirer {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: #fff;
    color: #c0392b;
    cursor: pointer;
    font-size: 1.1rem;
    line-height: 1;
    box-shadow: 0 2px 6px rgba(25, 53, 43, 0.15);
  }

  /* --- Champs --- */
  input[type='text'],
  input[type='number'],
  select,
  textarea {
    border: 1.5px solid #e4e1d6;
    border-radius: 10px;
    padding: 0.7rem 0.9rem;
    font-size: 0.95rem;
    font-family: inherit;
    width: 100%;
    box-sizing: border-box;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: #2f7d5b;
    box-shadow: 0 0 0 3px rgba(47, 125, 91, 0.12);
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  .deposer-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .deposer-prix {
    display: flex;
    align-items: center;
    border: 1.5px solid #e4e1d6;
    border-radius: 10px;
    padding: 0 0.9rem;
  }

  .deposer-prix input {
    border: none;
    padding: 0.7rem 0;
  }

  .deposer-prix input:focus {
    box-shadow: none;
  }

  .deposer-prix span {
    color: #6b6960;
    font-weight: 600;
  }

  .error {
    color: #c0392b;
    font-size: 0.9rem;
    margin: 0;
  }

  .deposer-actions {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-top: 0.5rem;
  }

  .button-primary {
    background: #2f7d5b;
    color: #fff;
    border: none;
    border-radius: 999px;
    padding: 0.75rem 1.75rem;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
  }

  .button-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .button-text {
    color: #2f7d5b;
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
  }
</style>
