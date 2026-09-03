# TrocTroc — Carnet de bord

Suivi au fil de l'eau du travail réalisé sur le projet, par l'équipe (Narimen — Tech Lead, Chris — Product Owner, Tahma — Scrum Master).

## Vendredi 28 août 2026

**Objectif** : lancer le projet — poser la structure technique du monorepo.

**Travail réalisé** (Narimen) :

- Initialisation du dépôt (`chore: initialize project`)
- Mise en place du monorepo npm workspaces (`frontend`, `backend`) et scaffold SvelteKit (`add develop`)
- Configuration Docker et Sequelize pour le backend (`chore: steup docker and sequilize`, sur `develop`)

## Lundi 31 août 2026

**Objectif** : formaliser la conception (déjà produite en amont) dans le dépôt, puis démarrer l'intégration frontend.

**Travail réalisé** (Chris, branche `chris-troc`) :

- Ajout de toute la documentation de conception : cahier des charges, user stories, MCD/MLD, dictionnaire des données, endpoints, wireframes (9 écrans, 8 maquettés sur Figma) — `docs/conception/`
- Ajout du guide de contribution (Conventional Commits) — `CONTRIBUTING.md`
- Mise à jour des dépendances (`@sveltejs/kit`, `@sveltejs/adapter-auto`, `eslint-plugin-vue`) et de la config ESLint
- Mise à jour du README (stack, structure, installation)
- Client API frontend (`frontend/src/lib/api.js`) pour les futurs appels au backend
- Construction de l'écran 1/9 (Accueil, US01) en SvelteKit : header, recherche, catégories, dernières annonces — données mockées en attendant les routes `GET /categories` et `GET /annonces`
- Extraction des styles dans `frontend/src/app.css`, appliqué globalement via `+layout.svelte`
- Application de la charte graphique v1 (fond `#0F1B24`, papier `#ECEEE7`, confiance `#4FA894`, repère `#E0A63C`) définie lors du sprint 0
- Passage du header et de la recherche du hero en mobile-first (empilés sur petit écran, en ligne à partir de 768px)
- Construction de l'écran 5/9 (Inscription, US02) : formulaire prénom/nom/email/code postal/mot de passe + confirmation, validation client (champs requis, format, correspondance des mots de passe) — pas encore relié au backend, `POST /auth/register` n'existe pas

**Points de vigilance** :

- `eslint.config.mjs` utilise `eslint-plugin-vue` alors que le projet est en SvelteKit — à corriger (remplacer par un plugin ESLint adapté à Svelte).
- Deux versions différentes des endpoints coexistent dans `docs/conception/` (`/api/v1/...` + PATCH dans le cahier des charges, `/api/...` + PUT dans `troctroc-endpoints.md`) — à trancher en équipe avant de brancher le formulaire d'inscription sur un vrai backend.
- La charte graphique v1 ne définit pas de couleur d'erreur/danger ; le message d'erreur du formulaire d'inscription réutilise l'ambre "repère" en attendant.

**À suivre** : écran Connexion, puis Liste des annonces, puis initialisation du serveur Express (actuellement seul `backend/package.json` existe, pas de `index.js`).

## Mardi 1er septembre 2026

**Objectif** : poursuivre l'intégration frontend (liste des annonces, détail d'une annonce) et récupérer les derniers livrables de conception.

**Travail réalisé** (Chris, branche `chris-troc`) :

- Construction de l'écran Liste des annonces : grille de cartes, filtre par catégorie
- Ajout du bouton de bascule thème clair/sombre (`ThemeToggle`)
- Construction de l'écran Détail d'une annonce : fiche article, annonces similaires
- Remplacement du placeholder texte "photo" par un visuel générique sur les cartes annonces
- Remplacement du logo texte par le logo TrocTroc (version mobile)
- Import des derniers livrables de conception (charte graphique, MCD, favicon) via l'interface web GitHub ("Add files via upload")
- Mise à jour du MCD/MLD/dictionnaire des données suite à la révision du MCD
- Application de la charte graphique officielle sur les écrans Liste et Détail

**Points de vigilance** :

- Les fichiers de conception ajoutés via l'upload web GitHub n'ont pas été relus en local avant intégration.
- Toujours pas de branchement sur un vrai backend : les listes/détails d'annonces restent sur données mockées.

**À suivre** : écran Dépôt d'une annonce, puis fusion de `chris-troc` dans `develop`.

## Mercredi 2 septembre 2026

**Objectif** : finaliser l'écran Dépôt d'annonce, fusionner `chris-troc` dans `develop` et se resynchroniser avec le reste de l'équipe.

**Travail réalisé** (Chris, branche `chris-troc` puis `develop`) :

- Construction de l'écran Déposer une annonce (formulaire + styles partagés `app.css`) et raccordement des écrans Accueil/Annonces/Détail/Dépôt (`feat integration of listings`)
- Fusion de `chris-troc` dans `develop` en local
- Synchronisation de `develop` avec `origin/develop` (le dépôt distant avait avancé de son côté : renommage `backend/` → `api/`, modèles Sequelize et seed de la base de données, apportés par Narimen)
- Résolution des conflits de fusion : `README.md` (formulation de la section Équipe), `eslint.config.mjs` (abandon de la config orientée Vue signalée comme point de vigilance le 31/08, au profit de la config js/json/markdown/css d'`origin/develop`), `package-lock.json` (conflit modification/suppression)
- Publication de `develop` à jour sur `origin`
- Création de la branche `nouvelle-branch` à partir de `develop` (nom provisoire, à renommer)
- Repérage et correction d'une page orpheline : l'écran Messagerie ajouté par Tahma (`ajout de la vue messagerie`, `messagerie`) n'était relié depuis aucune autre page du site ; ajout d'un lien "Messagerie" dans la navigation des écrans Accueil/Annonces/Détail/Dépôt

**Difficultés rencontrées** :

- `develop` local et `origin/develop` avaient fortement divergé (du travail avait été committé directement sur `develop` plutôt que sur une branche dédiée), ce qui a demandé une fusion manuelle à plusieurs conflits plutôt qu'un simple push
- Un `package-lock.json` non suivi en local bloquait la fusion (fichier régénérable, mis de côté avant le merge)
- Difficulté à retrouver les branches des coéquipiers sur le remote : pas de branche `narimen` visible (probablement pas encore poussée), seulement `tahma-project`

**Points de vigilance** :

- `nouvelle-branch` doit être renommée avant d'y démarrer le prochain développement
- Les liens `/categories`, `/connexion`, `/cgu`, `/a-propos`, `/contact` pointent vers des pages qui n'existent pas encore côté frontend

**À suivre** : renommer `nouvelle-branch` selon la fonctionnalité à développer, créer les pages manquantes (Connexion, Catégories, CGU, À propos, Contact).

## Jeudi 3 septembre 2026

**Objectif** : combler un des liens morts repérés la veille en créant la page Catégories.

**Travail réalisé** (Chris, branche `nouvelle-branch`) :

- Construction de l'écran Catégories (`frontend/src/routes/categories/+page.svelte`) : grille de toutes les catégories avec le nombre d'annonces par catégorie, chaque tuile renvoyant vers `/annonces?categorie=...` (même comportement que les tuiles de l'accueil)
- Réutilisation des données mockées (`categories`, `annonces` de `$lib/annonces.js`) et des classes déjà stylées (`.categories`, `.categories-grid` d'`app.css`) plutôt que de dupliquer du CSS, en suivant le même header/pied de page/fil d'Ariane que les autres écrans
- Vérification : `npm run check` (aucune nouvelle erreur introduite) et rendu manuel via le serveur de dev

**Points de vigilance** :

- Le nombre d'annonces par catégorie est calculé sur tout le catalogue mocké (disponibles + vendues) ; à revoir une fois `GET /categories` disponible côté API.
- `nouvelle-branch` toujours pas renommée.
- Liens `/connexion`, `/cgu`, `/a-propos`, `/contact` toujours morts.

**À suivre** : renommer `nouvelle-branch`, créer les pages Connexion, CGU, À propos, Contact.
