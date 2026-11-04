<!-- src/routes/espace-personnel/+page.svelte -->

<script>
  import { onMount } from 'svelte';
  import Header from '$lib/Header.svelte';

  import api from '$lib/api.js';
  import { urlPhoto } from '$lib/apiPhoto';
  import { authStore } from '$lib/store/auth.svelte.js';
  //import { goto } from '$app/navigation';

  let annonces = $state([]);
  let chargement = $state(true);
  let erreur = $state('');
  let filtreActif = $state('toutes');

  onMount(async () => {
    try {
      annonces = await api('/api/v1/annonces/mes-annonces');
    } catch (e) {
      erreur = e.message;
    }
  });

  let nbDisponibles = $derived(annonces.filter((a) => a.status?.name === 'Disponible').length);
  let nbVendues = $derived(annonces.filter((a) => a.status?.name === 'Vendu').length);

  let annoncesFiltrees = $derived.by(() => {
    if (filtreActif === 'disponible')
      return annonces.filter((a) => a.status?.name === 'Disponible');
    if (filtreActif === 'vendu') return annonces.filter((a) => a.status?.name === 'Vendu');
    return annonces;
  });

  function formaterDate(dateIso) {
    return new Date(dateIso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
</script>

<svelte:head>
  <title>TrocTroc — Mon espace personnel</title>
</svelte:head>

<header>
  <Header />
</header>

<main class="espace-main">
  <div class="espace-profil">
    <div class="avatar">
      {authStore.user?.firstName?.[0] ?? ''}{authStore.user?.lastName?.[0] ?? ''}
    </div>

    <div class="profil-infos">
      <h1>{authStore.user?.firstName} {authStore.user?.lastName}</h1>
      <p class="profil-meta">{authStore.user?.email}</p>
    </div>

    <a class="button-accent" href="/deposer"> + Déposer une annonce </a>
  </div>

  <nav class="espace-tabs">
    <span class="tab tab-active">Mes annonces</span>
    <a class="tab" href="/mon-profil">Mes informations</a>
    <a class="tab" href="/messagerie">Messagerie</a>
  </nav>

  <div class="espace-stats">
    <div class="stat-card">
      <span class="stat-valeur">{nbDisponibles}</span>
      <span class="stat-label">Annonces actives</span>
    </div>
    <div class="stat-card">
      <span class="stat-valeur">{nbVendues}</span>
      <span class="stat-label">Annonces vendues</span>
    </div>
  </div>

  <div class="espace-filtres">
    <button
      class="pill"
      class:pill-active={filtreActif === 'toutes'}
      onclick={() => (filtreActif = 'toutes')}
    >
      Toutes ({annonces.length})
    </button>
    <button
      class="pill"
      class:pill-active={filtreActif === 'disponible'}
      onclick={() => (filtreActif = 'disponible')}
    >
      Disponibles ({nbDisponibles})
    </button>
    <button
      class="pill"
      class:pill-active={filtreActif === 'vendu'}
      onclick={() => (filtreActif = 'vendu')}
    >
      Vendues ({nbVendues})
    </button>
  </div>

  <div class="liste-main">
    <h1>Toutes les annonces</h1>

    <div class="liste-grille">
      {#each annonces as annonce (annonce.id)}
        <a class="carte-annonce" href={`/annonces/${annonce.id}`}>
          <div class="carte-image">
            {#if annonce.photos?.[0]}
              <img src={urlPhoto(annonce.photos[0].url)} alt={annonce.title} />
            {:else}
              <svg viewBox="0 0 24 24" width="32" height="32">
                <path
                  d="M4 17 L4 9 L9 4 L15 4 L20 9 L20 17 Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <circle
                  cx="12"
                  cy="11"
                  r="3"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
              </svg>
            {/if}
            {#if annonce.category}
              <span class="carte-badge">{annonce.category.name}</span>
            {/if}
          </div>

          <div class="carte-corps">
            <h2>{annonce.title}</h2>
            <span class="carte-prix">{annonce.price} €</span>
            {#if annonce.user}
              <span class="carte-vendeur">{annonce.user.firstName} {annonce.user.lastName}</span>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  </div>
</main>

<style>
  .liste-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
  }

  .liste-main h1 {
    font-family: Cambria, Georgia, serif;
    font-size: 1.8rem;
    color: #19352b;
    margin: 0 0 1.5rem;
  }

  .liste-message {
    color: #6b6960;
    text-align: center;
    padding: 3rem 0;
  }

  .form-error {
    color: #c0392b;
  }

  .liste-grille {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
  }

  @media (max-width: 900px) {
    .liste-grille {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 500px) {
    .liste-grille {
      grid-template-columns: 1fr;
    }
  }

  .carte-annonce {
    display: block;
    background: #fff;
    border: 1.5px solid #e4e1d6;
    border-radius: 16px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition:
      border-color 0.15s ease,
      transform 0.15s ease;
  }

  .carte-annonce:hover {
    border-color: #2f7d5b;
    transform: translateY(-2px);
  }

  .carte-image {
    aspect-ratio: 1 / 0.75;
    background: #e4e1d6;
    color: #b3afa0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .carte-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .carte-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #fff;
    color: #2f7d5b;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.2rem 0.6rem;
    border-radius: 10px;
  }

  .carte-corps {
    padding: 0.9rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .carte-corps h2 {
    margin: 0;
    font-size: 0.95rem;
    color: #19352b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .carte-prix {
    font-weight: 700;
    color: #2f7d5b;
    font-size: 1.05rem;
  }

  .carte-vendeur {
    font-size: 0.75rem;
    color: #8c897e;
  }
  .site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 2rem;
    border-bottom: 1px solid #e4e1d6;
  }

  .espace-main {
    max-width: 960px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
  }

  .espace-profil {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #e4f0ea;
    color: #2f7d5b;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .profil-infos {
    flex: 1;
  }

  .profil-infos h1 {
    margin: 0;
    font-size: 1.3rem;
    font-family: Cambria, Georgia, serif;
  }

  .profil-meta {
    margin: 0.15rem 0 0;
    color: #6b6960;
    font-size: 0.85rem;
  }

  .button-accent {
    background: #f4c95d;
    color: #19352b;
    font-weight: 600;
    border: none;
    border-radius: 999px;
    padding: 0.65rem 1.25rem;
    text-decoration: none;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  .espace-tabs {
    display: flex;
    gap: 1.5rem;
    border-bottom: 1px solid #e4e1d6;
    margin-bottom: 1.5rem;
  }

  .tab {
    padding-bottom: 0.6rem;
    color: #6b6960;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
  }

  .tab-active {
    color: #19352b;
    font-weight: 700;
    border-bottom: 2px solid #2f7d5b;
  }

  .espace-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    background: #f4f6f4;
    border-radius: 14px;
    padding: 1.1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .stat-valeur {
    font-size: 1.6rem;
    font-weight: 700;
    color: #2f7d5b;
  }

  .stat-label {
    font-size: 0.8rem;
    color: #6b6960;
  }

  .espace-filtres {
    display: flex;
    gap: 0.6rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .pill {
    border: 1px solid #e4e1d6;
    background: #fff;
    border-radius: 999px;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: #19352b;
    cursor: pointer;
  }

  .pill-active {
    background: #2f7d5b;
    border-color: #2f7d5b;
    color: #fff;
  }

  .form-error {
    color: #c0392b;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
</style>
