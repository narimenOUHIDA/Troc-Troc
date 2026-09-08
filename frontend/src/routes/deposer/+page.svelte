<script>
  import Header from '$lib/Header.svelte';
  import api from '$lib/api';
  import { goto } from '$app/navigation';

  let title = $state('');
  let description = $state('');
  let price = $state('');
  let categoryId = $state('');
  let error = $state('');

  async function onPublier() {
    error = '';

    try {
      const data = await api('/listings', 'POST', {
        title,
        description,
        price,
        categoryId,
      });

      console.log('creation OK', data);
      goto('/dashboard/mes-annonces');
    } catch (e) {
      error = e.message;
    }
  }
</script>

<svelte:head>
  <title>TrocTroc — Déposer une annonce</title>
</svelte:head>

<Header connecte={false} />

<main class="deposer-main">
  <h1>Déposer une annonce</h1>

  <form class="deposer-form" onsubmit={onPublier}>
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
          <option value="" disabled selected>Choisir une catégorie</option>
          {#each categoryId as categorieDisponible (categorieDisponible)}
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
