<script>
  // Écran 2/9 des wireframes : Liste des annonces (US07, US08, US09, US10)

  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import api from '$lib/api.js';
  import Header from '$lib/Header.svelte';

  const categorieUrl = page.url.searchParams.get('categorie');
  let recherche = $state(page.url.searchParams.get('q') ?? '');
  let categoriesSelectionnees = $state(categorieUrl ? [categorieUrl] : []);
  let codePostal = $state(page.url.searchParams.get('codePostal') ?? '');
  let rayonKm = $state(50);
  let prixMin = $state('');
  let prixMax = $state('');
  let tri = $state('recent');

  let toutesLesAnnonces = $state([]);
  let categoriesDisponibles = $state([]);
  let chargement = $state(true);
  let erreur = $state('');

  let pageCourante = $state(1);
  const parPage = 9;

  function toggleCategorie(categorie) {
    categoriesSelectionnees = categoriesSelectionnees.includes(categorie)
      ? categoriesSelectionnees.filter((c) => c !== categorie)
      : [...categoriesSelectionnees, categorie];
  }

  onMount(async () => {
    try {
      const [reponseAnnonces, reponseCategories] = await Promise.all([
        api('/api/v1/annonces'),
        api('/categories'),
      ]);
      toutesLesAnnonces = reponseAnnonces.data;
      categoriesDisponibles = reponseCategories.map((c) => c.name);
    } catch (e) {
      erreur = e.message;
    } finally {
      chargement = false;
    }
  });

  $effect(() => {
    categoriesSelectionnees;
    prixMin;
    prixMax;
    recherche;
    tri;
    pageCourante = 1;
  });

  let annoncesFiltrees = $derived(
    toutesLesAnnonces.filter((annonce) => {
      if (
        categoriesSelectionnees.length > 0 &&
        !categoriesSelectionnees.includes(annonce.category?.name)
      ) {
        return false;
      }
      if (recherche.trim()) {
        const motsCles = recherche.trim().toLowerCase();
        const correspond =
          annonce.title.toLowerCase().includes(motsCles) ||
          annonce.description.toLowerCase().includes(motsCles);
        if (!correspond) return false;
      }
      if (prixMin !== '' && Number(annonce.price) < Number(prixMin)) return false;
      if (prixMax !== '' && Number(annonce.price) > Number(prixMax)) return false;
      return true;
    }),
  );

  let annoncesTriees = $derived(
    [...annoncesFiltrees].sort((a, b) => {
      if (tri === 'prix-croissant') return Number(a.price) - Number(b.price);
      if (tri === 'prix-decroissant') return Number(b.price) - Number(a.price);
      // 'recent' : l'API trie déjà par publicationDate DESC, donc l'ordre reçu suffit.
      // 'proximite' : nécessite le filtre postalCode côté API (pas encore branché ici, voir note en bas).
      return 0;
    }),
  );

  let nbPages = $derived(Math.max(1, Math.ceil(annoncesTriees.length / parPage)));
  let annoncesPage = $derived(
    annoncesTriees.slice((pageCourante - 1) * parPage, pageCourante * parPage),
  );

  function urlPhoto(url) {
    return `${import.meta.env.VITE_API_URL}/${url}`;
  }
</script>

<svelte:head>
  <title>TrocTroc — Liste des annonces</title>
</svelte:head>

<Header />

<main>
  <div class="annonces-layout">
    <aside class="filtres" aria-label="Filtres">
      <h2>Filtres</h2>

      <fieldset>
        <legend>Catégorie</legend>
        {#each categoriesDisponibles as categorie (categorie)}
          <label>
            <input
              type="checkbox"
              checked={categoriesSelectionnees.includes(categorie)}
              onchange={() => toggleCategorie(categorie)}
            />
            {categorie}
          </label>
        {/each}
      </fieldset>

      <fieldset>
        <legend>Code postal</legend>
        <input
          type="text"
          bind:value={codePostal}
          inputmode="numeric"
          maxlength="5"
          placeholder="69003"
        />
      </fieldset>

      <fieldset>
        <legend>Rayon</legend>
        <input type="range" min="5" max="50" step="5" bind:value={rayonKm} />
        <span class="filtres-valeur">{rayonKm} km</span>
      </fieldset>

      <fieldset class="filtres-prix">
        <legend>Prix</legend>
        <label>
          Min
          <input type="number" min="0" bind:value={prixMin} placeholder="Min" />
        </label>
        <label>
          Max
          <input type="number" min="0" bind:value={prixMax} placeholder="Max" />
        </label>
      </fieldset>
    </aside>

    <section aria-label="Résultats">
      <div class="resultats-header">
        <p>
          {annoncesTriees.length} annonce{annoncesTriees.length > 1 ? 's' : ''} trouvée{annoncesTriees.length >
          1
            ? 's'
            : ''}
        </p>

        <label>
          Trier par :
          <select bind:value={tri}>
            <option value="recent">Plus récentes</option>
            <option value="prix-croissant">Prix croissant</option>
            <option value="prix-decroissant">Prix décroissant</option>
          </select>
        </label>
      </div>

      {#if chargement}
        <p>Chargement des annonces...</p>
      {:else if erreur}
        <p class="form-error">{erreur}</p>
      {:else if annoncesPage.length === 0}
        <p>Aucune annonce ne correspond à ces critères.</p>
      {:else}
        <ul class="annonces-grid">
          {#each annoncesPage as annonce (annonce.id)}
            <li>
              <a class="carte-annonce" href={`/annonces/${annonce.id}`}>
                <div class="carte-image">
                  {#if annonce.photos?.[0]}
                    <img src={urlPhoto(annonce.photos[0].url)} alt={annonce.title} />
                  {:else}
                    <svg viewBox="0 0 24 24" width="28" height="28">
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

                  {#if annonce.status?.name === 'Vendu'}
                    <span class="carte-vendu">Vendu</span>
                  {/if}
                </div>

                <div class="carte-corps">
                  <h3>{annonce.title}</h3>
                  <span class="carte-prix">{annonce.price} €</span>
                  {#if annonce.user}
                    <span class="carte-vendeur"
                      >{annonce.user.firstName} {annonce.user.lastName}</span
                    >
                  {/if}
                </div>
              </a>
            </li>
          {/each}
        </ul>

        <nav class="pagination" aria-label="Pagination">
          <button type="button" disabled={pageCourante === 1} onclick={() => (pageCourante -= 1)}>
            &lsaquo;
          </button>
          {#each Array(nbPages) as _, i (i)}
            <button
              type="button"
              aria-current={pageCourante === i + 1 ? 'page' : undefined}
              onclick={() => (pageCourante = i + 1)}
            >
              {i + 1}
            </button>
          {/each}
          <button
            type="button"
            disabled={pageCourante === nbPages}
            onclick={() => (pageCourante += 1)}
          >
            &rsaquo;
          </button>
        </nav>
      {/if}
    </section>
  </div>
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

  .carte-vendu {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #5f5e5a;
    color: #fff;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.2rem 0.55rem;
    border-radius: 10px;
  }

  .carte-corps {
    padding: 0.9rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .carte-corps h3 {
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
</style>
