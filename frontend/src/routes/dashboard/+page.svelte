<!-- src/routes/espace-personnel/+page.svelte -->

<script>
  import { authStore } from '$lib/store/auth.svelte.js';
  import ThemeToggle from '$lib/ThemeToggle.svelte';
  import Logo from '$lib/Logo.svelte';

  // Données en dur temporairement
  const nbDisponibles = 2;
  const nbVendues = 1;

  const annonces = [
    {
      id: 1,
      title: 'MacBook Air M1',
      price: 650,
      status: 'Disponible',
      date: '1 septembre 2026',
    },
    {
      id: 2,
      title: 'Canapé deux places',
      price: 120,
      status: 'Vendue',
      date: '2 septembre 2026',
    },
    {
      id: 3,
      title: 'Vélo électrique',
      price: 450,
      status: 'Disponible',
      date: '3 septembre 2026',
    },
  ];
</script>

<svelte:head>
  <title>TrocTroc — Mon espace personnel</title>
</svelte:head>

<header class="site-header">
  <a class="logo" href="/">
    <Logo />
  </a>

  <ThemeToggle />
</header>

<main class="espace-main">
  <div class="espace-profil">
    <div class="avatar">
      {authStore.user?.firstName?.[0] ?? ''}
      {authStore.user?.lastName?.[0] ?? ''}
    </div>

    <div class="profil-infos">
      <h1>
        {authStore.user?.firstName}
        {authStore.user?.lastName}
      </h1>

      <p class="profil-meta">
        {authStore.user?.email}
      </p>
    </div>

    <a class="button-accent" href="/annonces/nouvelle"> + Déposer une annonce </a>
  </div>

  <nav class="espace-tabs">
    <span class="tab tab-active"> Mes annonces </span>

    <a class="tab" href="/mon-profil"> Mes informations </a>

    <a class="tab" href="/messagerie"> Messagerie </a>
  </nav>

  <div class="espace-stats">
    <div class="stat-card">
      <span class="stat-valeur">
        {nbDisponibles}
      </span>

      <span class="stat-label"> Annonces actives </span>
    </div>

    <div class="stat-card">
      <span class="stat-valeur">
        {nbVendues}
      </span>

      <span class="stat-label"> Annonces vendues </span>
    </div>
  </div>

  <div class="espace-filtres">
    <button class="pill pill-active">
      Toutes ({annonces.length})
    </button>

    <button class="pill">
      Disponibles ({nbDisponibles})
    </button>

    <button class="pill">
      Vendues ({nbVendues})
    </button>
  </div>

  <ul class="annonce-liste">
    {#each annonces as annonce (annonce.id)}
      <li class="annonce-ligne">
        <div class="annonce-photo" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path
              d="M4 17 L4 9 L9 4 L15 4 L20 9 L20 17 Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            />

            <circle cx="12" cy="11" r="3" fill="none" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </div>

        <div class="annonce-infos">
          <h2>
            {annonce.title}
          </h2>

          <span
            class="badge"
            class:badge-disponible={annonce.status === 'Disponible'}
            class:badge-vendu={annonce.status === 'Vendue'}
          >
            {annonce.status}
          </span>

          <span class="annonce-date">
            Publiée le {annonce.date}
          </span>
        </div>

        <span class="annonce-prix">
          {annonce.price} €
        </span>

        <div class="annonce-actions">
          <a class="icon-button" href="/annonces/1/modifier" title="Modifier">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                d="M4 20 L4 16 L15 5 L19 9 L8 20 Z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
            </svg>
          </a>

          <button class="icon-button" title="Marquer comme vendue">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                d="M4 12 L9 17 L20 5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <button class="icon-button icon-button-danger" title="Supprimer">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                d="M5 7 L19 7 M9 7 L9 4 L15 4 L15 7 M7 7 L7 20 L17 20 L17 7"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </li>
    {/each}
  </ul>
</main>

<style>
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

  .espace-message,
  .espace-vide {
    text-align: center;
    color: #6b6960;
    padding: 3rem 1rem;
  }

  .espace-vide {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .form-error {
    color: #c0392b;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .annonce-liste {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  .annonce-ligne {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: #fff;
    border: 1px solid #e4e1d6;
    border-radius: 14px;
    padding: 0.9rem 1.1rem;
  }

  .annonce-photo {
    width: 56px;
    height: 56px;
    border-radius: 10px;
    background: #e4e1d6;
    color: #b3afa0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .annonce-infos {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .annonce-infos h2 {
    margin: 0;
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .badge {
    display: inline-block;
    width: fit-content;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 0.15rem 0.6rem;
    border-radius: 999px;
  }

  .badge-disponible {
    background: #e4f0ea;
    color: #2f7d5b;
  }

  .badge-vendu {
    background: #edebe3;
    color: #5f5e5a;
  }

  .annonce-date {
    font-size: 0.78rem;
    color: #8c897e;
  }

  .annonce-prix {
    font-weight: 700;
    color: #2f7d5b;
    font-size: 1.05rem;
    flex-shrink: 0;
  }

  .annonce-actions {
    display: flex;
    gap: 0.4rem;
    flex-shrink: 0;
  }

  .icon-button {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid #e4e1d6;
    background: #fff;
    color: #19352b;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-decoration: none;
  }

  .icon-button-danger {
    color: #c0392b;
    border-color: #f3d4ce;
  }

  .modale-fond {
    position: fixed;
    inset: 0;
    background: rgba(25, 53, 43, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 50;
  }

  .modale-carte {
    background: #fff;
    border-radius: 18px;
    padding: 1.75rem;
    max-width: 400px;
    width: 100%;
  }

  .modale-carte h2 {
    margin: 0 0 0.6rem;
    font-size: 1.15rem;
  }

  .modale-carte p {
    margin: 0 0 1.25rem;
    color: #6b6960;
    font-size: 0.9rem;
  }

  .modale-actions {
    display: flex;
    gap: 0.75rem;
  }

  .button-secondaire,
  .button-danger {
    flex: 1;
    border-radius: 999px;
    padding: 0.65rem;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    border: 1px solid #e4e1d6;
  }

  .button-secondaire {
    background: #fff;
    color: #19352b;
  }

  .button-danger {
    background: #c0392b;
    border-color: #c0392b;
    color: #fff;
  }
</style>
