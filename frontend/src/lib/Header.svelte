<script>
  // En-tête du site, deux variantes selon docs/conception/charte (1).pdf §"La navigation" :
  // "Header desktop — visiteur (non connecté)" et "Header desktop — utilisateur connecté".
  // Il n'y a pas encore de session utilisateur côté frontend (voir /connexion, non implémentée),
  // donc toutes les pages passent `connecte={false}` pour l'instant ; ce composant existe pour que
  // le jour où une vraie session existera, il suffise de passer `connecte={true}` (+ les compteurs).
  //
  // Le tiroir mobile (hamburger) de la charte n'est pas repris ici : le header reste sur le même
  // empilement mobile-first (flex-wrap) que le reste du site plutôt que d'introduire un nouveau
  // pattern d'interaction.

  import ThemeToggle from '$lib/ThemeToggle.svelte';
  import Logo from '$lib/Logo.svelte';

  //let { connecte = false, initiales = 'MC', nbNotifications = 0, nbMessages = 0 } = $props();
</script>

<header class="site-header">
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

  <div class="header-auth">
    <ThemeToggle />

    <!-- Messagerie déjà branchée sur l'API (voir routes/messages/+page.svelte) : accessible même
		     en variante "visiteur", tant qu'il n'y a pas de vraie session pour distinguer les deux. -->
    <a class="header-icon-link" href="/messages" aria-label="Messagerie">
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect
          x="2.5"
          y="4.5"
          width="15"
          height="11"
          rx="1.5"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <path
          d="m3 5.5 7 5.5 7-5.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <!--{#if nbMessages > 0}<span class="header-badge">{nbMessages}</span>{/if}-->
    </a>

    <a class="bouton-deposer" href="/deposer">+ Déposer une annonce</a>

    <!--<a class="header-avatar" href="/profil" aria-label="Mon profil">{initiales}</a>-->

    <a class="button-secondary" href="/connexion">Se connecter</a>
    <a class="button-primary" href="/inscription">S'inscrire</a>
  </div>
</header>

<style>
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
</style>
