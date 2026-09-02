# TrocTroc — Dictionnaire des données

> Mis à jour le 01/09/2026 suite au [MCD.pdf](MCD.pdf) déposé dans le dépôt : ajout de `CODE_POSTAL` (`UTILISATEUR.code_postal` devient une FK plutôt qu'un simple texte), `PHOTO.ordre` et `MESSAGE.lu`. Détail dans [troctroc-mld.md](troctroc-mld.md#mise-à-jour-du-01092026).

### UTILISATEUR

| Attribut | Type | Taille/format | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| id_utilisateur | entier | — | oui | PK, auto-incrément | Identifiant unique de l'utilisateur |
| nom | varchar | 50 | oui | — | Nom de famille |
| prenom | varchar | 50 | oui | — | Prénom |
| email | varchar | 255 | oui | unique, format email valide | Adresse email de connexion |
| mot_de_passe | varchar | 255 | oui | stocké haché (ex. bcrypt) | Mot de passe de connexion |
| code_postal | varchar | 5 | oui | FK → CODE_POSTAL.code_postal | Lieu d'habitation, sert au calcul du rayon de 50 km |

### CODE_POSTAL

| Attribut | Type | Taille/format | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| code_postal | varchar | 5 | oui | PK, 5 chiffres | Code postal (clé métier, pas d'auto-incrément) |
| ville | varchar | 100 | oui | — | Nom de la ville associée au code postal |
| latitude | décimal | 9,6 | oui | — | Latitude du centre de la commune, pour le calcul de distance |
| longitude | décimal | 9,6 | oui | — | Longitude du centre de la commune, pour le calcul de distance |

### CATEGORIE

| Attribut | Type | Taille/format | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| id_categorie | entier | — | oui | PK, auto-incrément | Identifiant unique de la catégorie |
| nom | varchar | 50 | oui | unique | Nom de la catégorie (ex. "Vêtements") |

### STATUT

| Attribut | Type | Taille/format | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| id_statut | entier | — | oui | PK, auto-incrément | Identifiant unique du statut |
| nom | varchar | 50 | oui | unique | Libellé du statut |

> Valeurs à confirmer en équipe : le cahier des charges exige au minimum "disponible" et "vendu" (US21) ; le MCD fourni cite "active, supprimée" à titre d'exemple, qui fait potentiellement doublon avec `ANNONCE.date_suppression` ci-dessous.

### ANNONCE

| Attribut | Type | Taille/format | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| id_annonce | entier | — | oui | PK, auto-incrément | Identifiant unique de l'annonce |
| titre | varchar | 100 | oui | — | Titre de l'annonce |
| description | text | — | oui | — | Description détaillée de l'article |
| prix | décimal | 8,2 | oui | ≥ 0 | Prix de vente en euros |
| date_publication | datetime | — | oui | défaut = date du jour | Date de publication de l'annonce |
| date_suppression | datetime | — | non | `NULL` par défaut | Date de suppression douce (soft delete) ; `NULL` tant que l'annonce est active |
| id_utilisateur | entier | — | oui | FK → UTILISATEUR.id_utilisateur | Vendeur ayant créé l'annonce |
| id_categorie | entier | — | oui | FK → CATEGORIE.id_categorie | Catégorie de l'article |
| id_statut | entier | — | oui | FK → STATUT.id_statut | Statut courant de l'annonce |

### PHOTO

| Attribut | Type | Taille/format | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| id_photo | entier | — | oui | PK, auto-incrément | Identifiant unique de la photo |
| url | varchar | 255 | oui | — | Chemin/URL de l'image stockée |
| ordre | entier | — | oui | ≥ 0, défaut 0 | Position d'affichage dans la galerie (0 = photo principale) |
| id_annonce | entier | — | oui | FK → ANNONCE.id_annonce | Annonce illustrée par cette photo |

### CONVERSATION

| Attribut | Type | Taille/format | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| id_conversation | entier | — | oui | PK, auto-incrément | Identifiant unique de la conversation |
| date_creation | datetime | — | oui | défaut = date du jour | Date d'ouverture de la conversation |
| id_annonce | entier | — | oui | FK → ANNONCE.id_annonce | Annonce concernée par la conversation |

Les participants (acheteur et vendeur) sont rattachés à la conversation via `PARTICIPE`, plutôt que par une colonne `id_acheteur` directe sur `CONVERSATION`.

### PARTICIPE

| Attribut | Type | Taille/format | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| id_utilisateur | entier | — | oui | PK (composite), FK → UTILISATEUR.id_utilisateur | Utilisateur participant à la conversation (acheteur ou vendeur) |
| id_conversation | entier | — | oui | PK (composite), FK → CONVERSATION.id_conversation | Conversation concernée |

### MESSAGE

| Attribut | Type | Taille/format | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| id_message | entier | — | oui | PK, auto-incrément | Identifiant unique du message |
| contenu | text | — | oui | — | Texte du message |
| date_envoi | datetime | — | oui | défaut = date/heure actuelle | Date et heure d'envoi du message |
| lu | booléen | — | oui | défaut `false` | Indique si le destinataire a lu le message (pastille non lu, US15) |
| id_conversation | entier | — | oui | FK → CONVERSATION.id_conversation | Conversation à laquelle appartient le message |
| id_expediteur | entier | — | oui | FK → UTILISATEUR.id_utilisateur | Utilisateur (acheteur ou vendeur) ayant envoyé ce message |
