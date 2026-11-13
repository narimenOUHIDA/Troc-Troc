<script>
  // Page éditoriale, contenu statique — pas d'appel API.
  // Reprend le parcours utilisateur du cahier des charges (section 6) et des maquettes.

  import Header from '$lib/Header.svelte';

  const etapesAcheteur = [
    {
      titre: 'Recherchez près de chez vous',
      texte:
        'Parcourez les annonces filtrées automatiquement dans un rayon de 50 km autour de votre code postal.',
    },
    {
      titre: "Consultez le détail de l'article",
      texte: 'Photos, description, prix, état — toutes les informations pour vous décider.',
    },
    {
      titre: 'Contactez le vendeur',
      texte: 'Échangez directement via la messagerie interne pour convenir des modalités.',
    },
    {
      titre: 'Récupérez votre article',
      texte: 'Privilégiez une remise en main propre, dans un lieu public si possible.',
    },
  ];

  const etapesVendeur = [
    {
      titre: 'Déposez votre annonce',
      texte: "Ajoutez un titre, une description, un prix et jusqu'à 6 photos en quelques minutes.",
    },
    {
      titre: 'Répondez aux acheteurs',
      texte: 'Toutes les demandes arrivent directement dans votre messagerie TrocTroc.',
    },
    {
      titre: 'Gérez votre annonce',
      texte: 'Modifiez-la à tout moment depuis votre espace personnel, ou supprimez-la.',
    },
    {
      titre: 'Marquez-la comme vendue',
      texte: "Une fois l'article vendu, un simple clic met à jour son statut.",
    },
  ];
</script>

<svelte:head>
  <title>TrocTroc — Comment ça marche</title>
</svelte:head>

<Header />

<main class="cgm-page">
  <section class="cgm-hero">
    <h1>Comment ça marche ?</h1>
    <p>
      TrocTroc met en relation particuliers pour acheter, vendre et échanger des objets de seconde
      main, près de chez vous.
    </p>
  </section>

  <section class="cgm-bloc">
    <h2>Pour acheter</h2>
    <ol class="cgm-etapes">
      {#each etapesAcheteur as etape, i (etape.titre)}
        <li>
          <span class="cgm-numero">{i + 1}</span>
          <div>
            <h3>{etape.titre}</h3>
            <p>{etape.texte}</p>
          </div>
        </li>
      {/each}
    </ol>
  </section>

  <section class="cgm-bloc cgm-bloc-alt">
    <h2>Pour vendre</h2>
    <ol class="cgm-etapes">
      {#each etapesVendeur as etape, i (etape.titre)}
        <li>
          <span class="cgm-numero cgm-numero-accent">{i + 1}</span>
          <div>
            <h3>{etape.titre}</h3>
            <p>{etape.texte}</p>
          </div>
        </li>
      {/each}
    </ol>
  </section>

  <section class="cgm-securite">
    <h2>Conseils de sécurité</h2>
    <ul>
      <li>Privilégiez une remise en main propre dans un lieu public.</li>
      <li>Ne payez ou n'envoyez jamais d'argent avant d'avoir vu l'article.</li>
      <li>
        TrocTroc ne gère ni paiement ni livraison — les transactions se font directement entre
        particuliers.
      </li>
    </ul>
  </section>

  <section class="cgm-cta">
    <h2>Prêt à vous lancer ?</h2>
    <div class="cgm-cta-boutons">
      <a class="button-primary" href="/annonces">Voir les annonces</a>
      <a class="button-secondary" href="/deposer">Déposer une annonce</a>
    </div>
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
  .cgm-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 4rem;
  }

  .cgm-hero {
    text-align: center;
    margin-bottom: 3rem;
  }

  .cgm-hero h1 {
    font-family: Cambria, Georgia, serif;
    font-size: 2rem;
    color: #19352b;
    margin: 0 0 0.75rem;
  }

  .cgm-hero p {
    color: #6b6960;
    font-size: 1rem;
    max-width: 520px;
    margin: 0 auto;
  }

  .cgm-bloc {
    margin-bottom: 3rem;
  }

  .cgm-bloc h2 {
    font-family: Cambria, Georgia, serif;
    font-size: 1.4rem;
    color: #19352b;
    margin: 0 0 1.5rem;
  }

  .cgm-etapes {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .cgm-etapes li {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .cgm-numero {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #2f7d5b;
    color: #fff;
    font-weight: 700;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cgm-numero-accent {
    background: #f4c95d;
    color: #19352b;
  }

  .cgm-etapes h3 {
    margin: 0 0 0.3rem;
    font-size: 1rem;
    color: #19352b;
  }

  .cgm-etapes p {
    margin: 0;
    font-size: 0.9rem;
    color: #6b6960;
    line-height: 1.5;
  }

  .cgm-securite {
    background: #fbf3dc;
    border-radius: 16px;
    padding: 1.5rem 1.75rem;
    margin-bottom: 3rem;
  }

  .cgm-securite h2 {
    margin: 0 0 0.9rem;
    font-size: 1.1rem;
    color: #19352b;
  }

  .cgm-securite ul {
    margin: 0;
    padding-left: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .cgm-securite li {
    font-size: 0.88rem;
    color: #5c5230;
  }

  .cgm-cta {
    text-align: center;
  }

  .cgm-cta h2 {
    font-family: Cambria, Georgia, serif;
    font-size: 1.3rem;
    color: #19352b;
    margin: 0 0 1.25rem;
  }

  .cgm-cta-boutons {
    display: flex;
    justify-content: center;
    gap: 0.9rem;
  }

  .button-primary,
  .button-secondary {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 0.7rem 1.5rem;
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
  }

  .button-primary {
    background: #2f7d5b;
    color: #fff;
  }

  .button-secondary {
    background: #fff;
    color: #2f7d5b;
    border: 1.5px solid #2f7d5b;
  }
</style>
