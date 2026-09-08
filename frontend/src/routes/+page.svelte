<script>
  // Écran 1/9 des wireframes : Accueil (US01) — voir docs/conception/troctroc-wireframes.md §1.1

  import { trouverAnnonce } from '$lib/annonces.js';
  import Header from '$lib/Header.svelte';
  import AnnonceCard from '$lib/AnnonceCard.svelte';
  import Categories from '$lib/Categories.svelte';

  const idsDernieresAnnonces = [1, 4, 7, 5, 10, 6, 13, 16];
  const dernieresAnnonces = idsDernieresAnnonces.map((id) => trouverAnnonce(id));

  // Les deux formulaires de recherche (header + hero) soumettent en GET vers /annonces,
  // qui lit déjà q/codePostal depuis l'URL (voir routes/annonces/+page.svelte) : pas besoin
  // de gérer la navigation en JS, le comportement natif du <form> suffit.
</script>

<svelte:head>
  <title>TrocTroc — Achetez, vendez et échangez près de chez vous</title>
</svelte:head>

<!-- Pas encore de session utilisateur (voir Header.svelte) : variante "visiteur". -->
<Header connecte={false} />

<main>
  <!-- Bloc d'accroche : recherche "complète" (mots-clés + code postal) qui alimentera GET /annonces
	     avec les paramètres q/postalCode (voir docs/conception/troctroc-endpoints.md). -->
  <section class="hero">
    <h1>Achetez, vendez et échangez près de chez vous</h1>

    <form class="hero-search" method="GET" action="/annonces">
      <input
        type="text"
        name="q"
        placeholder="Ex. vélo, canapé, console..."
        aria-label="Mots-clés"
      />
      <input
        type="text"
        name="codePostal"
        placeholder="Code postal"
        aria-label="Code postal"
        inputmode="numeric"
        maxlength="5"
      />
      <button type="submit" class="button-primary">Rechercher</button>
    </form>
  </section>

  <!-- Grille des 8 catégories (US09) : chaque tuile pré-filtre la liste des annonces. -->
  <section class="categories">
    <h2>Catégories</h2>
    <ul class="categories-grid">
      <Categories />
    </ul>
  </section>

  <!-- Grille des dernières annonces publiées (US01) : chaque carte mène au détail (écran 1.3). -->
  <section class="annonces">
    <h2>Dernières annonces</h2>
    <ul class="annonces-grid">
      {#each dernieresAnnonces as annonce (annonce.id)}
        <AnnonceCard {annonce} />
      {/each}
    </ul>
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
