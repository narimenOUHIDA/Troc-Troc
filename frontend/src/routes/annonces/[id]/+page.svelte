<script>
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import api from '$lib/api.js';
  import Header from '$lib/Header.svelte';
  import { authStore } from '$lib/store/auth.svelte.js';

  let annonce = $state(null);
  let chargement = $state(true);
  let erreur = $state('');

  let modeEdition = $state(false);

  let title = $state('');
  let description = $state('');
  let price = $state('');
  let categoryId = $state('');

  let suppressionEnCours = $state(false);
  let modificationEnCours = $state(false);

  const annonceId = page.params.id;

  onMount(async () => {
    try {
      const response = await api(`/api/v1/annonces/${annonceId}`);

      annonce = response.data;

      // Pré-remplissage du formulaire
      title = annonce.title;
      description = annonce.description;
      price = annonce.price;
      categoryId = annonce.categoryId;
    } catch (e) {
      erreur = e.message;
    } finally {
      chargement = false;
    }
  });

  // Vérifie si l'utilisateur connecté est le propriétaire
  let estProprietaire = $derived(
    annonce && authStore.user && Number(annonce.user?.id) === Number(authStore.user.id),
  );

  function commencerModification() {
    modeEdition = true;
    erreur = '';
  }

  function annulerModification() {
    modeEdition = false;

    // Remet les anciennes valeurs
    title = annonce.title;
    description = annonce.description;
    price = annonce.price;
    categoryId = annonce.categoryId;

    erreur = '';
  }

  async function modifierAnnonce(event) {
    event.preventDefault();

    modificationEnCours = true;
    erreur = '';

    try {
      const response = await api(`/api/v1/annonces/${annonceId}`, 'PATCH', {
        title,
        description,
        price: Number(price),
        categoryId: Number(categoryId),
      });

      annonce = {
        ...annonce,
        ...response.data,
      };

      modeEdition = false;
    } catch (e) {
      erreur = e.message;
    } finally {
      modificationEnCours = false;
    }
  }

  async function supprimerAnnonce() {
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?');

    if (!confirmation) return;

    suppressionEnCours = true;
    erreur = '';

    try {
      await api(`/api/v1/annonces/${annonceId}`, 'DELETE');

      // Retour à la liste après suppression
      goto('/annonces');
    } catch (e) {
      erreur = e.message;
      suppressionEnCours = false;
    }
  }

  function urlPhoto(url) {
    return `${import.meta.env.VITE_API_URL}/${url}`;
  }
</script>

<svelte:head>
  <title>
    {annonce ? `TrocTroc — ${annonce.title}` : 'TrocTroc — Annonce'}
  </title>
</svelte:head>

<Header />

<main>
  {#if chargement}
    <p>Chargement de l'annonce...</p>
  {:else if erreur && !annonce}
    <p class="form-error">{erreur}</p>
  {:else if annonce}
    {#if erreur}
      <p class="form-error">{erreur}</p>
    {/if}

    {#if modeEdition}
      <!-- ========================= -->
      <!-- FORMULAIRE DE MODIFICATION -->
      <!-- ========================= -->

      <section class="detail-annonce">
        <h1>Modifier l'annonce</h1>

        <form onsubmit={modifierAnnonce}>
          <label>
            Titre
            <input type="text" bind:value={title} required maxlength="255" />
          </label>

          <label>
            Description
            <textarea bind:value={description} required rows="6"></textarea>
          </label>

          <label>
            Prix
            <input type="number" bind:value={price} min="0" step="0.01" required />
          </label>

          <label>
            Catégorie
            <input type="number" bind:value={categoryId} min="1" required />
          </label>

          <div class="actions">
            <button type="submit" disabled={modificationEnCours}>
              {modificationEnCours ? 'Modification...' : 'Enregistrer les modifications'}
            </button>

            <button type="button" class="button-secondary" onclick={annulerModification}>
              Annuler
            </button>
          </div>
        </form>
      </section>
    {:else}
      <!-- ================= -->
      <!-- DETAIL DE L'ANNONCE -->
      <!-- ================= -->

      <section class="detail-annonce">
        <div class="detail-image">
          {#if annonce.photos?.length}
            <img src={urlPhoto(annonce.photos[0].url)} alt={annonce.title} />
          {:else}
            <span>Aucune photo</span>
          {/if}
        </div>

        <div class="detail-contenu">
          {#if annonce.category}
            <span class="categorie">
              {annonce.category.name}
            </span>
          {/if}

          <h1>{annonce.title}</h1>

          <p class="prix">
            {annonce.price} €
          </p>

          {#if annonce.status}
            <p>
              Statut :
              <strong>{annonce.status.name}</strong>
            </p>
          {/if}

          <div class="description">
            <h2>Description</h2>
            <p>{annonce.description}</p>
          </div>

          {#if annonce.user}
            <div class="vendeur">
              <h2>Vendeur</h2>
              <p>
                {annonce.user.firstName}
                {annonce.user.lastName}
              </p>

              {#if annonce.user.PostalCode}
                <p>
                  {annonce.user.PostalCode.postalCode}
                  {annonce.user.PostalCode.city}
                </p>
              {/if}
            </div>
          {/if}

          <!-- ACTIONS PROPRIETAIRE -->

          {#if estProprietaire}
            <div class="actions-proprietaire">
              <button type="button" onclick={commencerModification}> Modifier l'annonce </button>

              <button
                type="button"
                class="button-delete"
                onclick={supprimerAnnonce}
                disabled={suppressionEnCours}
              >
                {suppressionEnCours ? 'Suppression...' : 'Supprimer lannonce'}
              </button>
            </div>
          {:else}
            <button type="button"> Contacter le vendeur </button>
          {/if}
        </div>
      </section>
    {/if}
  {/if}
</main>

<style>
  main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .detail-annonce {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .detail-image {
    aspect-ratio: 1 / 0.75;
    background: #e4e1d6;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8c897e;
  }

  .detail-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .detail-contenu {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .categorie {
    color: #2f7d5b;
    font-weight: 600;
  }

  h1 {
    margin: 0;
    color: #19352b;
    font-size: 2rem;
  }

  h2 {
    color: #19352b;
  }

  .prix {
    color: #2f7d5b;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .description,
  .vendeur {
    border-top: 1px solid #e4e1d6;
    padding-top: 1rem;
  }

  .actions,
  .actions-proprietaire {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  button {
    border: 0;
    border-radius: 8px;
    padding: 0.8rem 1.2rem;
    background: #2f7d5b;
    color: white;
    cursor: pointer;
    font-weight: 600;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .button-secondary {
    background: #e4e1d6;
    color: #19352b;
  }

  .button-delete {
    background: #b42318;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 700px;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-weight: 600;
  }

  input,
  textarea {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 0.8rem;
    font: inherit;
  }

  .form-error {
    color: #b42318;
    margin-bottom: 1rem;
  }

  @media (max-width: 700px) {
    .detail-annonce {
      grid-template-columns: 1fr;
    }

    .actions,
    .actions-proprietaire {
      flex-direction: column;
    }
  }
</style>
