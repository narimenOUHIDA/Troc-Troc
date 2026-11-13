<script>
  // Écran 1/9 des wireframes : Accueil (US01) — voir docs/conception/troctroc-wireframes.md §1.1

  import Header from '$lib/Header.svelte';
  import Categories from '$lib/Categories.svelte';
  import { onMount } from 'svelte';
  import api from '$lib/api.js';

  let toutesLesAnnonces = $state([]);
  let chargement = $state(true);
  let erreur = $state('');

  onMount(async () => {
    try {
      const response = await api('/api/v1/annonces');
      toutesLesAnnonces = response.data;
    } catch (e) {
      erreur = e.message;
    } finally {
      chargement = false;
    }
  });

  let dernieresAnnonces = $derived(toutesLesAnnonces.slice(0, 4));
  function urlPhoto(url) {
    return `${import.meta.env.VITE_API_URL}/${url}`;
  }

  let recherche = $state('');

  function onRechercher(event) {
    event.preventDefault();
    const params = recherche.trim() ? `?q=${encodeURIComponent(recherche.trim())}` : '';
    goto(`/annonces${params}`);
  }
</script>

<svelte:head>
  <title>TrocTroc — Achetez, vendez et échangez près de chez vous</title>
</svelte:head>

<header>
  <Header />
</header>

<main>
  <!-- Bloc d'accroche : recherche "complète" (mots-clés + code postal) qui alimentera GET /annonces
	     avec les paramètres q/postalCode (voir docs/conception/troctroc-endpoints.md). -->
  <section class="hero">
    <div class="hero-cercle hero-cercle-1"></div>
    <div class="hero-cercle hero-cercle-2"></div>

    <div class="hero-contenu">
      <h1>Donnez une seconde vie<br />à vos objets, près de chez vous.</h1>
      <p>
        Achetez, vendez et échangez entre particuliers dans un rayon de 50 km autour de chez vous.
      </p>

      <form class="hero-recherche" onsubmit={onRechercher}>
        <svg
          class="hero-recherche-icone"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.7" />
          <line
            x1="16.5"
            y1="16.5"
            x2="21"
            y2="21"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
          />
        </svg>
        <input
          type="text"
          bind:value={recherche}
          placeholder="Que recherchez-vous ? (ex: vélo, canapé...)"
        />
        <button type="submit">Rechercher</button>
      </form>
    </div>
  </section>

  <!-- Grille des 8 catégories (US09) : chaque tuile pré-filtre la liste des annonces. -->
  <section class="categories">
    <h2>Explorer par catégorie</h2>
    <ul class="categories-grid">
      <Categories />
    </ul>
  </section>

  <!-- Grille des dernières annonces publiées (US01) : chaque carte mène au détail (écran 1.3). -->
  <section class="annonces">
    <h2>Les dernières annonces</h2>
    {#if chargement}
      <p>Chargement des annonces...</p>
    {:else if erreur}
      <p class="form-error">{erreur}</p>
    {:else if dernieresAnnonces.length === 0}
      <p>Aucune annonce disponible.</p>
    {:else}
      <ul class="annonces-grid">
        {#each dernieresAnnonces as annonce (annonce.id)}
          <li>
            <a class="carte-annonce" href={`/annonces/${annonce.id}`}>
              <div class="carte-image">
                {#if annonce.photos?.[0]}
                  <img src={urlPhoto(annonce.photos[0].url)} alt={annonce.title} />
                {:else}
                  <span>Aucune photo</span>
                {/if}
                {#if annonce.category}
                  <span class="carte-badge"> {annonce.category.name} </span>
                {/if}
                {#if annonce.status?.name === 'Vendu'}
                  <span class="carte-vendu"> Vendu </span>
                {/if}
              </div>
              <div class="carte-corps">
                <h3>{annonce.title}</h3>
                <span class="carte-prix"> {annonce.price} € </span>
                {#if annonce.user}
                  <span class="carte-vendeur">
                    {annonce.user.firstName}
                    {annonce.user.lastName}
                  </span>
                {/if}
              </div>
            </a>
          </li>
        {/each}
      </ul>
    {/if}
    <a class="lien-voir-tout" href="/annonces">
      Voir tout
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
        <path
          d="M5 12 h13 M13 6 l6 6 -6 6"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </a>
  </section>
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
  .hero {
    position: relative;
    background: #19352b;
    overflow: hidden;
    padding: 3.5rem 2rem;
  }

  .hero-cercle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  .hero-cercle-1 {
    width: 280px;
    height: 280px;
    background: #2f7d5b;
    opacity: 0.35;
    top: -90px;
    right: -40px;
  }

  .hero-cercle-2 {
    width: 170px;
    height: 170px;
    background: #f4c95d;
    opacity: 0.18;
    bottom: -60px;
    right: 180px;
  }

  .hero-contenu {
    position: relative;
    max-width: 640px;
    margin: 0 auto;
    text-align: left;
  }

  .hero-contenu h1 {
    font-family: Cambria, Georgia, serif;
    font-size: 2.1rem;
    line-height: 1.25;
    color: #fff;
    margin: 0 0 1rem;
  }

  .hero-contenu p {
    color: #c9d6ce;
    font-size: 1rem;
    margin: 0 0 1.75rem;
  }

  .hero-recherche {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #fff;
    border-radius: 999px;
    padding: 0.35rem 0.35rem 0.35rem 1.1rem;
    max-width: 560px;
  }

  .hero-recherche-icone {
    color: #8c897e;
    flex-shrink: 0;
  }

  .hero-recherche input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 0.92rem;
    font-family: inherit;
    background: transparent;
  }

  .hero-recherche button {
    background: #2f7d5b;
    color: #fff;
    border: none;
    border-radius: 999px;
    padding: 0.7rem 1.4rem;
    font-weight: 600;
    font-size: 0.88rem;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .hero-recherche button:hover {
    background: #26694b;
  }

  @media (max-width: 600px) {
    .hero-recherche {
      flex-wrap: wrap;
      border-radius: 20px;
      padding: 0.9rem;
    }

    .hero-recherche button {
      width: 100%;
    }
  }
  .annonces-grid {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  .carte-annonce {
    display: block;
    background: #fff;
    border: 1.5px solid #e4e1d6;
    border-radius: 16px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
  }
  .carte-image {
    aspect-ratio: 1 / 0.75;
    background: #e4e1d6;
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
    padding: 0.2rem 0.6rem;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 600;
  }
  .carte-vendu {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #5f5e5a;
    color: #fff;
    padding: 0.2rem 0.55rem;
    border-radius: 10px;
    font-size: 0.68rem;
    font-weight: 700;
  }
  .carte-corps {
    padding: 0.9rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .carte-corps h3 {
    margin: 0;
    color: #19352b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .carte-prix {
    color: #2f7d5b;
    font-size: 1.05rem;
    font-weight: 700;
  }
  .carte-vendeur {
    color: #8c897e;
    font-size: 0.75rem;
  }
  .form-error {
    color: #b42318;
  }
  @media (max-width: 800px) {
    .annonces-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 500px) {
    .annonces-grid {
      grid-template-columns: 1fr;
    }
  }
  .lien-voir-tout {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: #2f7d5b;
    font-weight: 600;
    font-size: 0.88rem;
    text-decoration: none;
  }

  .lien-voir-tout svg {
    transition: transform 0.15s ease;
  }

  .lien-voir-tout:hover {
    color: #26694b;
  }

  .lien-voir-tout:hover svg {
    transform: translateX(3px);
  }
</style>
