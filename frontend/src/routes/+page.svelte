<script>

  // Données en dur (mock) pour valider l'affichage dynamique avant l'interconexion avec l'API
  const categories = [
    { name:'Voitures', icon: 'car' },
    { name:'Maison', icon: 'home' },
    { name:'high-tech', icon: 'computer' },
    { name:'vetements', icon: 'tshirt' },
    { name: 'sport', icon: 'velo' },
    { name:'ameublement', icon: 'couch' },
    { name:'animaux', icon: 'dog' },
    { name:'loisirs', icon: 'manettes' },

  ];

  // Fake data pour tester le rendu de la grille d'annonces
  const derniereAnnonces = [
    {id: 1, titre: 'VTT Btwin', prix:'80€', cp:'75011'},
    {id: 2, titre : 'Canapé 3 places', prix:'150€', cp:'91000'},
    {id: 3, titre : 'Iphone 12', prix:'400€', cp:'77000'},
    {id: 4, titre :'Manga Naruto', prix:'10€', cp:'75013'},
  ];
</script>

<div class = "main-container"> </div>

  <!-- HEADER : Elements essentiels du haut de page ( Recherche + Accès rapide )-->

<header class="header">
 <div class="logo-box">
 <a href="/" class="logo"> TROC TROC </a>
 </div>

 <!-- Input unique pour simplifier la recherche globale sur le MVP -->
  <div class = "search-bar">
    <input type = "text" placeholder="Rechercher sur TrocTroc..." />
  </div>

  <!-- CTA principaux isolés à droite pour l'experience utilisateur -->
   <div class = "user-actions">
    <a href="/annonces/creer" class="btn-add">+ Déposer une annonce </a>
    <a href="/login" class = "link-auth">Connexion / Inscription </a>
  </div>
  </header>

<!-- Partie Presentation-->

  <section class= "hero-banner">
    <h1>PRESENTATION TROC TROC </h1>
    <p>La plateforme d'échange et de troc de proximité.</p>
    </section>

<!-- Partie Catégories-->

    <section class="block-section">
    <h2> Catégories </h2>
    <div class="categories-grid">
      {#each categories as cat}
        <div class="category-item">
         <span class="icon"> {cat.icon}</span>
         <p>{cat.name}</p>

        </div>
         {/each}
    </div>
    </section>

    <!-- Partie Dernière annonces-->

    <section class= "block-section ">
    <h2>Dernières anonces</h2>
    <div class="annonces-grid">
      {#each derniereAnnonces as annonce}
      <a href="/annonces/ {annonce.id}" class="annonce-card">
        <div class="img-placeholder">
          <span> [IMAGE]</span>
        </div>
        <div class="card-info">
          <h3>{annonce.titre}</h3>
          <p class="price">: {annonce.prix}</p>
          <span class="location">[{annonce.cp}]</span>

        </div>
      </a>
      {/each}
    </div>
    </section>

    <!-- Style CSS LOCAUX -->
    <style>

      /* Conteneur principal : fixe une largeur max et centre la page a l'ecran */

    .main-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 16px;
      font-family: Arial, sans-serif;
    }

     /* En-tête : Alignement horizontal des 3 blocs ( Logo , Recherche , BOutons) */
    .header {
      display:flex;                           /*Active Flexbox pour tout aligner sur une ligne  */
      align-items: center;                     /* Centre verticalement les éléments sur la même ligne*/
      justify-content: space-between;          /*Pousse le logo à gauche , les boutons à droite et la recherche au centre  */
      gap: 15px;
      padding-bottom : 15px;
      border-bottom: 2px solid #eaeaea;       /* Ligne de séparation sous le header */
    }

     /* Style du Logo */
    .logo {
      font-weight: bold;
      font-size:1.4rem;
      text-decoration:none;                     /* Supprime le soulignement bleu par défaut du lien */
      color:#333;
    }

      /* Conteneur de la barre de Recherche : occupe tout l'espace au centre*/
    .search-bar {
      flex: 1;                                 /* Prend tout l'espace disponible entre le logo et les boutons */
      max-width: 500px;                        /* Limite la largeur max pour ne pas qu'elle soit géante  */
    }


      /*Champ saisie (input) */
    .search-bar input {
      width: 100%;                              /* remplit 100% de son conteneur .search-bar */
      padding: 8px 12px;
      border-radius: 4px;                        /*Coins légèrement arrondis */
      border: 1px solid #ccc;
    }


       /*Bloc des boutons Utilisateur (à droite) */
    .user-actions {
      display: flex;
      align-items: center;
      gap: 12px;                                 /* Espcace entre le bouton d'ajout et le lien de connexion */
    }


     /* bouton d'action principal "+ Deposer une annonce" (Call to action )*/
    .btn-add {

      background-color: #2563eb;              /*  bleau voyant pour inciter au clic */
      color:white;
      padding: 8px 14px;
      border-radius: 4px;
      text-decoration: none;
      font-size: 0.9rem;
    }


     /* Lien de connexion / inscription (moins voyant que le bouton d'action) */
    .link-auth{
      color: #4b5563;
      text-decoration: none;
      font-size : 0.9rem;
    }

     /* Bannière de présentation (Hero Banner) : texte centré sur fond gris clair */
    .hero-banner {
      background-color :#f3f4f6;               /*fond gris clair pour faire ressortir le bloc */
      padding: 30px;
      text-align: center;
      border-radius: 8px;
      margin: 20px 0;                             /* Espacement avec le header et la section suivante */
    }

     /* Titre de la bannière : taille plus grande et marge inférieure */
    .hero-banner h1 {
      margin: 0 0 10px 0 ;                         /* Nettoie les marges par défaut des titres h1 */
      font-size: 1.6rem;
    }

     /*Espacement standard pour chaque grande section de la page  */
    .block-section {
      margin-bottom: 30px;
    }

     /* Style des titres de section  ( Categories , Dernières annonces )*/
    .block-section h2 {
      font-size: 1.2rem;
      border-bottom: 1px solid #ddd;               /*Soulignement léger sous chaque titre */
      padding-bottom: 5px;
      margin-bottom: 15px;
    }

     /* Grille des catégories : utilise CSS Grid pour un affichage flexible et responsive */
    .categories-grid {
      display:grid;
       /* Utilisation de repeat(auto-fill, minmax()) pour créer autant de colonnes que possible avec une largeur minimale de 100px et une largeur maximale de 1 fraction de l'espace disponible */
      grid-template-columns: repeat( auto-fill, minmax(100px, 1fr));
      gap: 12px;
    }

     /* Carte individuelle d'une catégorie */
    .category-item {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 12px;
      text-align : center;
      background:#fff;
      cursor: pointer;                           /* Curseur sous forme de main pour indiquer que c'est clicable */
    }

    .category-item .icon {
      font-size: 1.8rem;
      display: block;
      margin-bottom: 4px;
    }

    .category-item p {
      margin: 0;
      font-size: 0.85rem;
    }

    .annonces-grid {
      display:grid;
      grid-template-columns: repeat( auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .annonce-card {
      border : 1px solid #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
      text-decoration: none;
      color: inherit;
      background: #fff;
    }

    .img-placeholder {
      height : 130px;
      background-color: #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      font-size: 0.85rem;
    }

    .card-info {
      padding: 10px;
    }

    .card-info h3 {
      margin: 0 0 6px 0;
      font-size: 0.95rem;
    }

    .price {
      margin: 0;
      font-weight: bold;
      color: #059669;
    }

    .location {
      font-size: 0.8rem;
      color: #6b7280;
    }
    </style>


