# TrocTroc — Endpoints API

Liste des routes de l'API (REST), classées par ressource. Chaque endpoint renvoie à la user story qu'il couvre (voir [troctroc-user-stories.md](troctroc-user-stories.md)).

## Authentification

| Méthode | Route | Description | Auth requise | US |
|---|---|---|---|---|
| POST | `/api/auth/register` | Créer un compte | Non | US1 |
| POST | `/api/auth/login` | Se connecter | Non | US2 |
| POST | `/api/auth/logout` | Se déconnecter | Oui | US3 |

## Annonces

| Méthode | Route | Description | Auth requise | US |
|---|---|---|---|---|
| GET | `/api/annonces` | Liste des annonces. Paramètres : `categorie`, `q` (recherche), `code_postal`, `rayon` (défaut 50km) | Non | US4, US6, US7 |
| GET | `/api/annonces/:id` | Détail d'une annonce | Non | US8 |
| POST | `/api/annonces` | Créer une annonce (titre, description, prix, catégorie, photo(s)) | Oui | US5 |
| PUT | `/api/annonces/:id` | Modifier une de mes annonces | Oui (propriétaire) | US9 |
| DELETE | `/api/annonces/:id` | Supprimer une de mes annonces | Oui (propriétaire) | US10 |
| PATCH | `/api/annonces/:id/statut` | Marquer une annonce comme vendue | Oui (propriétaire) | US11 |

> `DELETE` effectue une suppression douce (renseigne `ANNONCE.date_suppression`) : l'annonce n'est pas supprimée physiquement, elle disparaît simplement des résultats. `PATCH .../statut` met à jour `ANNONCE.id_statut` (FK vers `STATUT`, voir [dictionnaire des données](troctroc-dictionnaire-donnees.md)).

## Catégories

| Méthode | Route | Description | Auth requise | US |
|---|---|---|---|---|
| GET | `/api/categories` | Liste des catégories disponibles | Non | US4, US6 |

## Utilisateur / Espace personnel

| Méthode | Route | Description | Auth requise | US |
|---|---|---|---|---|
| GET | `/api/users/me` | Récupérer mon profil | Oui | US2 |
| GET | `/api/users/me/annonces` | Récupérer mes annonces (espace personnel) | Oui | US9, US10, US11 |

## Photos

| Méthode | Route | Description | Auth requise | US |
|---|---|---|---|---|
| POST | `/api/annonces/:id/photos` | Ajouter une photo à une annonce | Oui (propriétaire) | US5 |
| DELETE | `/api/photos/:id` | Supprimer une photo | Oui (propriétaire) | US9 |
