# TrocTroc — Cahier des charges

## 1. Le contexte

Développement d'une plateforme qui s'appelle Troc Troc de petites annonces entre particuliers pour l'achat, la vente et l'échange d'articles.

## 2. Problématique

Comment faciliter l'achat et la vente d'objets de seconde main entre particuliers en privilégiant les échanges locaux, tout en proposant une expérience simple et accessible.

## 3. La cible

Particuliers.

## 4. La solution

Troc Troc sera une plateforme web de petites annonces entre particuliers permettant aux utilisateurs de publier, rechercher et consulter des annonces d'objets de seconde main dans leur zone géographique.

La plateforme facilitera la mise en relation entre acheteurs et vendeurs grâce à une recherche par catégorie, une barre de recherche et un système de filtrage géographique permettant d'afficher les annonces situées dans un rayon de 50 km autour de l'utilisateur.

Lorsqu'un utilisateur trouve une annonce qui l'intéresse, il pourra consulter les informations détaillées de l'article et contacter directement le vendeur grâce à une messagerie interne. Une conversation sera associée à l'annonce concernée afin que l'acheteur et le vendeur puissent échanger sur l'article, son prix et les modalités de la transaction.

Une fois l'accord conclu entre les deux particuliers, la transaction pourra être réalisée directement entre eux, sans paiement ni livraison gérés par Troc Troc. Le vendeur pourra ensuite marquer l'annonce comme vendue, afin qu'elle ne soit plus proposée comme disponible.

La plateforme propose également un espace personnel permettant à chaque utilisateur de gérer ses annonces, ses conversations et ses informations personnelles.

## 5. Les fonctionnalités principales (MVP)

- **Page d'accueil** : présentation de Troc Troc avec les dernières annonces publiées et les catégories disponibles.
- **Système d'inscription et de connexion** : création de compte, connexion, déconnexion.
- **Dépôt d'annonce** : formulaire de création d'une annonce avec titre, description, prix, catégorie et photo(s).
- **Consultation des annonces** : liste des annonces avec filtres par catégorie et barre de recherche. Les annonces disponibles sont seulement celles dans un rayon de 50 km autour de l'utilisateur (en se basant sur le code postal).
- **Page de détail d'une annonce** : informations complètes sur l'article et bouton de contact du vendeur (redirection vers email ou formulaire de message).
- **Espace personnel** : gestion de ses propres annonces (modification, suppression, marquage comme vendu).
- **Messagerie interne** : système de messages entre acheteurs et vendeurs directement sur la plateforme.

## 6. Les évolutions potentielles

- **Système de favoris** : sauvegarder des annonces pour les retrouver facilement.
- **Évaluations et avis** : notation des vendeurs après une transaction.
- **Tableau de bord d'administration** : modération des annonces signalées, gestion des utilisateurs.

## 7. Le parcours utilisateur principal

Le parcours principal de Troc Troc permet à un utilisateur de rechercher une annonce à proximité, de consulter son détail puis de contacter le vendeur via une messagerie interne.

Les deux utilisateurs peuvent alors échanger afin de convenir des modalités de la transaction.

Une fois l'article vendu, le vendeur peut marquer l'annonce comme vendue. Un utilisateur peut également publier et gérer ses propres annonces depuis son espace personnel.

## 8. Les technologies

| Domaine | Choix |
|---|---|
| Frontend | JavaScript, Svelte |
| Backend | Node.js, Express |
| BDD | PostgreSQL |
| ORM | Sequelize |
| Authentification | JWT + cookies HTTP-only, ou sessions selon ce qui a été appris |
| Outils | Git / GitHub |
| Déploiement | Docker |

**Justification de stack :**

Le choix de cette stack repose principalement sur sa cohérence avec les besoins fonctionnels de Troc Troc, sa capacité à gérer une architecture frontend/backend séparée ainsi que les compétences acquises par l'équipe au cours de la formation.

Les technologies retenues permettent de mettre en pratique les notions de développement frontend, création d'API REST, gestion d'une base de données relationnelle, authentification, sécurité, versioning et déploiement. Ce choix permet également de conserver une architecture suffisamment simple pour le MVP tout en laissant la possibilité de faire évoluer l'application par la suite.

## 9. Les objectifs du projet

L'objectif de Troc Troc est de concevoir et développer une plateforme web de mise en relation entre particuliers permettant l'achat, la vente et l'échange d'objets de seconde main. La plateforme vise à faciliter les transactions locales en proposant aux utilisateurs de consulter et publier des annonces dans un rayon de 50 km autour de leur localisation.

## Navigateurs compatibles

Tous les navigateurs.

## Arborescence de l'application

*À compléter.*

## Wireframes

Wireframes basse-fidélité (structure uniquement, pas de charte graphique). 8 des 9 écrans maquettés sur Figma (fil de conversation en attente), captures versionnées dans [`wireframes/`](wireframes/) : **[voir sur Figma](https://www.figma.com/design/iIAIDpAAOYb3ngBN7xPtw7)**. Description texte des 9 écrans, y compris l'authentification et la messagerie interne, avec les captures Figma intégrées : **[troctroc-wireframes.md](troctroc-wireframes.md)**.

Écrans couverts (détail dans [troctroc-wireframes.md](troctroc-wireframes.md)) :

- **Accueil** — logo/navigation, barre de recherche, catégories, dernières annonces (US01).
- **Liste des annonces** — filtres (recherche, catégorie, code postal, rayon 50 km), grille de résultats (US07, US08, US09, US10).
- **Détail d'une annonce** — photos, prix, description, informations vendeur, bouton "Contacter le vendeur" (US11, US12).
- **Authentification** — connexion et inscription (US02, US03).
- **Dépôt d'annonce** — formulaire titre / description / prix / catégorie / photos (US05, US06).
- **Espace personnel** — onglets Mes annonces / Mes conversations / Mon profil, tableau des annonces avec actions modifier/marquer vendu/supprimer (US18 à US21).
- **Messagerie interne** — liste des conversations et fil de discussion (US13 à US17).

## Les endpoints de l'API

### Authentification

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Créer un compte utilisateur |
| POST | `/api/v1/auth/login` | Authentifier un utilisateur |
| POST | `/api/v1/auth/logout` | Déconnecter l'utilisateur |
| GET | `/api/v1/auth/me` | Récupérer les informations de l'utilisateur connecté |

### Utilisateur

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/v1/users/me` | Consulter son profil |
| PATCH | `/api/v1/users/me` | Modifier son profil |

### Annonces

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/v1/annonces` | Consulter les annonces avec recherche et filtres |
| GET | `/api/v1/annonces/:id` | Consulter le détail d'une annonce |
| POST | `/api/v1/annonces` | Créer une nouvelle annonce |
| PATCH | `/api/v1/annonces/:id` | Modifier une annonce |
| DELETE | `/api/v1/annonces/:id` | Supprimer une annonce |
| PATCH | `/api/v1/annonces/:id/status` | Modifier le statut d'une annonce, notamment la marquer comme vendue |
| GET | `/api/v1/users/me/annonces` | Consulter ses propres annonces |

> `DELETE` effectue une suppression douce (`ANNONCE.date_suppression`), pas une suppression physique. `PATCH .../status` met à jour `ANNONCE.id_statut` (FK vers la table `STATUT`, voir [dictionnaire des données](troctroc-dictionnaire-donnees.md)).

**Recherche et filtres** (paramètres de requête sur `GET /api/v1/annonces`) :

```
GET /api/v1/annonces?search=velo
GET /api/v1/annonces?categoryId=2
GET /api/v1/annonces?postalCode=69001
```

### Catégories

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/v1/categories` | Récupérer les catégories disponibles |
| GET | `/api/v1/categories/:id` | Consulter une catégorie |

### Photos

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/v1/annonces/:annonceId/photos` | Ajouter une photo à une annonce |
| DELETE | `/api/v1/photos/:id` | Supprimer une photo |

### Conversations

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/v1/conversations` | Consulter ses conversations |
| GET | `/api/v1/conversations/:id` | Consulter une conversation |
| POST | `/api/v1/conversations` | Démarrer une conversation à partir d'une annonce |

> Les participants (acheteur et vendeur) sont rattachés à la conversation via la table `PARTICIPE` : `GET /conversations` retourne les conversations où l'utilisateur connecté figure comme participant (voir [MLD](troctroc-mld.md)).

### Messages

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/v1/conversations/:conversationId/messages` | Consulter les messages d'une conversation |
| POST | `/api/v1/conversations/:conversationId/messages` | Envoyer un message dans une conversation |

## User stories

### Accueil

- **US01 — Consulter l'accueil** : En tant que visiteur, je veux consulter la page d'accueil afin de découvrir Troc Troc, les dernières annonces et les catégories disponibles.

### Authentification

- **US02 — Créer un compte** : En tant que visiteur, je veux créer un compte afin de pouvoir utiliser les fonctionnalités nécessitant une authentification.
- **US03 — Se connecter** : En tant qu'utilisateur, je veux me connecter afin d'accéder à mon espace personnel et aux fonctionnalités réservées aux membres.
- **US04 — Se déconnecter** : En tant qu'utilisateur, je veux me déconnecter afin de sécuriser mon compte.

### Annonces

- **US05 — Publier une annonce** : En tant qu'utilisateur, je veux créer une annonce avec un titre, une description, un prix, une catégorie et une ou plusieurs photos afin de proposer mon article.
- **US06 — Ajouter des photos** : En tant que vendeur, je veux ajouter une ou plusieurs photos à mon annonce afin de présenter mon article aux acheteurs.
- **US07 — Consulter les annonces** : En tant que visiteur ou utilisateur, je veux consulter les annonces disponibles afin de trouver un article qui m'intéresse.
- **US08 — Rechercher une annonce** : En tant que visiteur ou utilisateur, je veux rechercher une annonce par mots-clés afin de trouver rapidement un article.
- **US09 — Filtrer par catégorie** : En tant que visiteur ou utilisateur, je veux filtrer les annonces par catégorie afin de trouver plus facilement le type d'article recherché.
- **US10 — Consulter les annonces à proximité** : En tant que visiteur ou utilisateur, je veux voir les annonces situées dans un rayon de 50 km autour de moi afin de favoriser les échanges locaux.

### Détail d'une annonce

- **US11 — Consulter le détail** : En tant que visiteur ou utilisateur, je veux consulter le détail d'une annonce afin de connaître les caractéristiques, le prix, les photos et les informations nécessaires concernant l'article.
- **US12 — Contacter le vendeur** : En tant qu'utilisateur, je veux contacter le vendeur depuis l'annonce afin d'échanger avec lui au sujet de l'article.

### Messagerie interne

- **US13 — Démarrer une conversation** : En tant qu'acheteur, je veux démarrer une conversation avec le vendeur depuis une annonce afin de pouvoir échanger avec lui.
- **US14 — Envoyer un message** : En tant qu'utilisateur, je veux envoyer un message à un autre utilisateur afin d'échanger au sujet d'une annonce.
- **US15 — Consulter mes conversations** : En tant qu'utilisateur, je veux consulter mes conversations afin de retrouver mes échanges avec les vendeurs ou acheteurs.
- **US16 — Consulter une conversation** : En tant qu'utilisateur, je veux consulter les messages d'une conversation afin de suivre mon échange avec l'autre utilisateur.
- **US17 — Répondre à un message** : En tant qu'utilisateur, je veux répondre à un message afin de poursuivre la discussion avec l'autre utilisateur.

### Espace personnel

- **US18 — Consulter mes annonces** : En tant qu'utilisateur, je veux consulter mes annonces afin de gérer les articles que j'ai publiés.
- **US19 — Modifier une annonce** : En tant que vendeur, je veux modifier mon annonce afin de mettre à jour ses informations.
- **US20 — Supprimer une annonce** : En tant que vendeur, je veux supprimer mon annonce afin de ne plus la proposer à la vente.
- **US21 — Marquer une annonce comme vendue** : En tant que vendeur, je veux marquer mon annonce comme vendue afin d'indiquer qu'elle n'est plus disponible.

## Rôles des utilisateurs

- **Visiteur** : utilisateur non connecté.
- **Utilisateur authentifié** : il peut agir comme acheteur ou vendeur selon le contexte (ce n'est pas deux comptes séparés, juste un rôle contextuel sur la même entité `UTILISATEUR` — voir le [MCD](troctroc-user-stories-mcd.md)).

## Rôles de l'équipe

- **Narimen** : Tech Lead
- **Chris** : Product Owner
- **Tahma** : Scrum Master

---

Voir aussi : [MCD](troctroc-user-stories-mcd.md) · [MLD](troctroc-mld.md) · [Dictionnaire des données](troctroc-dictionnaire-donnees.md)
