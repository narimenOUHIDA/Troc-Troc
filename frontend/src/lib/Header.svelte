<script>
  // En-tête du site, deux variantes selon docs/conception/charte (1).pdf §"La navigation" :
  // "Header desktop — visiteur (non connecté)" et "Header desktop — utilisateur connecté".

  import { goto } from '$app/navigation';
  import ThemeToggle from '$lib/ThemeToggle.svelte';
  import Logo from '$lib/Logo.svelte';
  import { authStore, clearAuth } from '$lib/store/auth.svelte.js';

  let menuOuvert = $state(false);

  function toggleMenu() {
    menuOuvert = !menuOuvert;
  }
  function fermerMenu() {
    menuOuvert = false;
  }
  function logout() {
    clearAuth();
    fermerMenu();
    goto('/');
  }
</script>

<header class="site-header">
  <div class="header-gauche">
    <a class="logo" href="/"><Logo /></a>

    <nav class="header-nav" aria-label="Navigation principale">
      <a href="/">Accueil</a>
      <a href="/categories">
        Catégories
        <svg class="header-nav-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <polyline
            points="5 8 10 13 15 8"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </a>
      <a href="/comment-ca-marche">Comment ça marche</a>
    </nav>
  </div>

  <div class="header-actions">
    <a class="bouton-deposer" href="/deposer">
      <span class="bouton-deposer-icone">+</span>
      Déposer une annonce
    </a>

    {#if !authStore.user}
      <div class="header-non-auth">
        <a class="button-secondary" href="/connexion">Se connecter</a>
        <a class="button-primary" href="/inscription">S'inscrire</a>
      </div>
    {:else}
      <a class="icon-button" href="/messagerie" aria-label="Messagerie" title="Messagerie">
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true">
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="3"
            stroke="currentColor"
            stroke-width="1.6"
          />
          <path
            d="M4 7 L12 13 L20 7"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <!-- Badge de messages non lus — à brancher une fois l'endpoint de comptage disponible -->
        <!-- <span class="icon-badge">3</span> -->
      </a>

      <div class="user-menu">
        <button class="user-button" onclick={toggleMenu} aria-expanded={menuOuvert}>
          <div class="avatar">
            {authStore.user.firstName?.[0] ?? ''}{authStore.user.lastName?.[0] ?? ''}
          </div>
          <span class="user-name">{authStore.user.firstName}</span>
          <svg
            class="chevron"
            class:chevron-ouvert={menuOuvert}
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <polyline
              points="5 8 10 13 15 8"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        {#if menuOuvert}
          <div class="dropdown">
            <a href="/espace-personnel" onclick={fermerMenu}>Mon espace</a>
            <a href="/mon-profil" onclick={fermerMenu}>Mes informations</a>
            <a href="/messagerie" onclick={fermerMenu}>Messagerie</a>
            <hr />
            <button class="dropdown-logout" onclick={logout}>Déconnexion</button>
          </div>
        {/if}
      </div>
    {/if}

    <ThemeToggle />
  </div>
</header>

<style>
  .site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 0.9rem 2rem;
    background: #fff;
    border-bottom: 1px solid #e4e1d6;
    position: relative;
  }

  /* --- Groupe gauche : logo + nav principale --- */
  .header-gauche {
    display: flex;
    align-items: center;
    gap: 2.5rem;
  }

  .logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    flex-shrink: 0;
  }

  .header-nav {
    display: flex;
    align-items: center;
    gap: 1.75rem;
  }

  .header-nav a {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: #19352b;
    text-decoration: none;
    font-size: 0.92rem;
    font-weight: 500;
  }

  .header-nav a:hover {
    color: #2f7d5b;
  }

  .header-nav-chevron {
    width: 14px;
    height: 14px;
  }

  /* --- Groupe droite : tout le reste --- */
  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    flex-shrink: 0;
    margin-left: auto;
  }

  /* --- Bouton "Déposer une annonce" --- */
  .bouton-deposer {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: #f4c95d;
    color: #19352b;
    font-weight: 600;
    font-size: 0.88rem;
    border: none;
    border-radius: 999px;
    padding: 0.6rem 1.25rem;
    text-decoration: none;
    white-space: nowrap;
    transition:
      background 0.15s ease,
      transform 0.1s ease;
  }

  .bouton-deposer:hover {
    background: #eebb3f;
  }

  .bouton-deposer:active {
    transform: scale(0.97);
  }

  .bouton-deposer-icone {
    font-weight: 700;
    font-size: 1rem;
    line-height: 1;
  }

  /* --- Visiteur non connecté --- */
  .header-non-auth {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .button-secondary,
  .button-primary {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 0.55rem 1.1rem;
    font-size: 0.85rem;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
  }

  .button-secondary {
    background: #fff;
    color: #2f7d5b;
    border: 1.5px solid #2f7d5b;
  }

  .button-secondary:hover {
    background: #e4f0ea;
  }

  .button-primary {
    background: #2f7d5b;
    color: #fff;
    border: 1.5px solid #2f7d5b;
  }

  .button-primary:hover {
    background: #26694b;
  }

  /* --- Icône messagerie (connecté uniquement) --- */
  .icon-button {
    position: relative;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #19352b;
    text-decoration: none;
    flex-shrink: 0;
  }

  .icon-button:hover {
    background: #f4f6f4;
  }

  .icon-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #e85d5d;
    color: #fff;
    font-size: 0.62rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fff;
  }

  /* --- Utilisateur connecté --- */
  .user-menu {
    position: relative;
  }

  .user-button {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.3rem 0.4rem 0.3rem 0.3rem;
    border-radius: 999px;
  }

  .user-button:hover {
    background: #f4f6f4;
  }

  .avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #e4f0ea;
    color: #2f7d5b;
    border: 1.5px solid #2f7d5b;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.78rem;
    flex-shrink: 0;
  }

  .user-name {
    font-size: 0.88rem;
    font-weight: 600;
    color: #19352b;
  }

  .chevron {
    width: 14px;
    height: 14px;
    color: #6b6960;
    transition: transform 0.15s ease;
  }

  .chevron-ouvert {
    transform: rotate(180deg);
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    background: #fff;
    border: 1px solid #e4e1d6;
    border-radius: 14px;
    box-shadow: 0 8px 24px rgba(25, 53, 43, 0.12);
    padding: 0.5rem;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    z-index: 20;
  }

  .dropdown a,
  .dropdown-logout {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    color: #19352b;
    text-decoration: none;
    font-size: 0.88rem;
    padding: 0.6rem 0.7rem;
    border-radius: 8px;
    cursor: pointer;
  }

  .dropdown a:hover,
  .dropdown-logout:hover {
    background: #f4f6f4;
  }

  .dropdown-logout {
    color: #c0392b;
    font-family: inherit;
  }

  .dropdown hr {
    border: none;
    border-top: 1px solid #e4e1d6;
    margin: 0.4rem 0;
  }

  @media (max-width: 860px) {
    .header-nav {
      display: none; /* pas de tiroir mobile pour l'instant, cf. commentaire d'origine */
    }
  }
</style>
