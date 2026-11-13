<script>
  // Page dédiée aux catégories — étend la section "Explorer par catégorie" de l'accueil
  // en page complète, avec le compte d'annonces par catégorie si l'API le fournit.

  import { onMount } from 'svelte';
  import api from '$lib/api.js';
  import Header from '$lib/Header.svelte';

  const ICONES = {
    Meubles: 'sofa',
    Vélos: 'bike',
    Vêtements: 'clothes',
    Électroménager: 'electro',
    Livres: 'book',
    Jouets: 'toys',
    Informatique: 'computer',
    Maison: 'sofa',
  };

  let categories = $state([]);
  let chargement = $state(true);
  let erreur = $state('');

  onMount(async () => {
    try {
      categories = await api('/categories');
    } catch (e) {
      erreur = e.message;
    } finally {
      chargement = false;
    }
  });

  function icone(nom) {
    return ICONES[nom] ?? 'default';
  }
</script>

<svelte:head>
  <title>TrocTroc — Catégories</title>
</svelte:head>

<Header />

<main class="categories-page">
  <p class="fil-ariane">Accueil / Catégories</p>
  <h1>Toutes les catégories</h1>
  <p class="sous-titre">
    Parcourez les annonces par type d'objet pour trouver plus vite ce que vous cherchez.
  </p>

  {#if chargement}
    <p class="message">Chargement des catégories...</p>
  {:else if erreur}
    <p class="message erreur">{erreur}</p>
  {:else}
    <div class="grille">
      {#each categories as categorie (categorie.id)}
        <a class="tuile" href={`/annonces?categorie=${encodeURIComponent(categorie.name)}`}>
          <span class="tuile-icone" data-icone={icone(categorie.name)}>
            {#if icone(categorie.name) === 'sofa'}
              <svg viewBox="0 0 24 24" width="26" height="26">
                <rect
                  x="4"
                  y="11"
                  width="16"
                  height="7"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                />
                <path
                  d="M4 11 V8 a2 2 0 0 1 4 0"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                />
                <path
                  d="M20 11 V8 a2 2 0 0 0 -4 0"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                />
              </svg>
            {:else if icone(categorie.name) === 'bike'}
              <svg viewBox="0 0 24 24" width="26" height="26">
                <circle
                  cx="6"
                  cy="17"
                  r="3.2"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <circle
                  cx="18"
                  cy="17"
                  r="3.2"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M6 17 L11 8 L17 8 L18 17 M9 12 L15 12"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
              </svg>
            {:else if icone(categorie.name) === 'clothes'}
              <svg viewBox="0 0 24 24" width="26" height="26">
                <path
                  d="M8 5 L11 3.5 Q12 6 13 3.5 L16 5 L19 8 L16.5 10 L15 8.5 L15 20 L9 20 L9 8.5 L7.5 10 L5 8 Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
              </svg>
            {:else if icone(categorie.name) === 'electro'}
              <svg viewBox="0 0 24 24" width="26" height="26">
                <rect
                  x="6"
                  y="3"
                  width="12"
                  height="18"
                  rx="1.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <line x1="6" y1="13" x2="18" y2="13" stroke="currentColor" stroke-width="1.2" />
                <circle cx="12" cy="8" r="1.3" fill="currentColor" />
              </svg>
            {:else if icone(categorie.name) === 'book'}
              <svg viewBox="0 0 24 24" width="26" height="26">
                <path
                  d="M4 5 h6 a2 2 0 0 1 2 2 v13 a2 2 0 0 0 -2 -2 h-6 Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
                <path
                  d="M20 5 h-6 a2 2 0 0 0 -2 2 v13 a2 2 0 0 1 2 -2 h6 Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
              </svg>
            {:else if icone(categorie.name) === 'toys'}
              <svg viewBox="0 0 24 24" width="26" height="26">
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M4 12 h16 M12 4 v16"
                  stroke="currentColor"
                  stroke-width="1"
                  opacity="0.5"
                />
              </svg>
            {:else if icone(categorie.name) === 'computer'}
              <svg viewBox="0 0 24 24" width="26" height="26">
                <rect
                  x="4"
                  y="5"
                  width="16"
                  height="10"
                  rx="1.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <line x1="9" y1="19" x2="15" y2="19" stroke="currentColor" stroke-width="1.5" />
                <line x1="12" y1="15" x2="12" y2="19" stroke="currentColor" stroke-width="1.5" />
              </svg>
            {:else}
              <svg viewBox="0 0 24 24" width="26" height="26">
                <rect
                  x="5"
                  y="7"
                  width="14"
                  height="12"
                  rx="1.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <line x1="5" y1="11" x2="19" y2="11" stroke="currentColor" stroke-width="1.2" />
              </svg>
            {/if}
          </span>
          <span class="tuile-nom">{categorie.name}</span>
        </a>
      {/each}
    </div>
  {/if}
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
  .categories-page {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
  }

  .fil-ariane {
    color: #8c897e;
    font-size: 0.8rem;
    margin: 0 0 0.6rem;
  }

  .categories-page h1 {
    font-family: Cambria, Georgia, serif;
    font-size: 1.8rem;
    color: #19352b;
    margin: 0 0 0.4rem;
  }

  .sous-titre {
    color: #6b6960;
    font-size: 0.92rem;
    margin: 0 0 2rem;
  }

  .message {
    color: #6b6960;
    text-align: center;
    padding: 2rem 0;
  }

  .erreur {
    color: #c0392b;
  }

  .grille {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.1rem;
  }

  @media (max-width: 750px) {
    .grille {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 480px) {
    .grille {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .tuile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.7rem;
    background: #fff;
    border: 1.5px solid #e4e1d6;
    border-radius: 18px;
    padding: 1.75rem 1rem;
    text-decoration: none;
    color: inherit;
    transition:
      border-color 0.15s ease,
      transform 0.15s ease;
  }

  .tuile:hover {
    border-color: #2f7d5b;
    transform: translateY(-2px);
  }

  .tuile-icone {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background: #e4f0ea;
    color: #2f7d5b;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tuile-nom {
    font-size: 0.9rem;
    font-weight: 600;
    color: #19352b;
    text-align: center;
  }
</style>
