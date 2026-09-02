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
