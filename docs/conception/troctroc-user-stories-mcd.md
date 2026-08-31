# TrocTroc — User Stories & MCD (Modèle Conceptuel de Données)

## User Stories

1. **Inscription**
   En tant que visiteur, je veux créer un compte, afin de pouvoir déposer et gérer mes annonces.

2. **Connexion**
   En tant qu'utilisateur inscrit, je veux me connecter, afin d'accéder à mon espace personnel.

3. **Déconnexion**
   En tant qu'utilisateur connecté, je veux me déconnecter, afin de sécuriser mon compte sur un appareil partagé.

4. **Page d'accueil**
   En tant que visiteur, je veux voir les dernières annonces et les catégories dès la page d'accueil, afin de découvrir rapidement ce qui est disponible.

5. **Dépôt d'annonce**
   En tant qu'utilisateur connecté, je veux publier une annonce (titre, description, prix, catégorie, photo), afin de vendre un article.

6. **Consultation des annonces**
   En tant que visiteur, je veux filtrer les annonces par catégorie et les rechercher par mot-clé, afin de trouver rapidement un article qui m'intéresse.

7. **Annonces à proximité**
   En tant que visiteur, je veux ne voir que les annonces situées dans un rayon de 50 km autour de chez moi, afin de trouver des articles faciles à récupérer.

8. **Détail d'une annonce**
   En tant que visiteur, je veux consulter la page détaillée d'une annonce, afin de voir toutes les infos et contacter le vendeur.

9. **Modifier une annonce**
   En tant qu'utilisateur connecté, je veux modifier une de mes annonces, afin de corriger ou mettre à jour ses informations.

10. **Supprimer une annonce**
    En tant qu'utilisateur connecté, je veux supprimer une de mes annonces, afin de la retirer si je ne souhaite plus la vendre.

11. **Marquer comme vendu**
    En tant qu'utilisateur connecté, je veux marquer une annonce comme vendue, afin d'informer les autres visiteurs qu'elle n'est plus disponible.



### Entités

> `UTILISATEUR` représente les comptes inscrits : chaque ligne de la table est une personne différente (il y en a donc plusieurs, un par inscrit). Les **visiteurs non inscrits** ne sont pas modélisés ici : ils n'ont aucune donnée à stocker et consultent `ANNONCE`/`CATEGORIE` sans authentification. Une personne n'apparaît dans `UTILISATEUR` qu'à partir de son inscription.

**UTILISATEUR**
| Attribut | Type |
|---|---|
| id_utilisateur (id) | entier |
| nom | texte |
| prenom | texte |
| email | texte |
| mot_de_passe | texte |
| code_postal | texte |

**CATEGORIE**
| Attribut | Type |
|---|---|
| id_categorie (id) | entier |
| nom | texte |

**STATUT**
| Attribut | Type |
|---|---|
| id_statut (id) | entier |
| nom | texte |

**ANNONCE**
| Attribut | Type |
|---|---|
| id_annonce (id) | entier |
| titre | texte |
| description | texte |
| prix | décimal |
| date_publication | date |
| date_suppression | date (nullable) |

**PHOTO**
| Attribut | Type |
|---|---|
| id_photo (id) | entier |
| url | texte |

**CONVERSATION**
| Attribut | Type |
|---|---|
| id_conversation (id) | entier |
| date_creation | date |

**MESSAGE**
| Attribut | Type |
|---|---|
| id_message (id) | entier |
| contenu | texte |
| date_envoi | date |

> `UTILISATEUR` joue plusieurs rôles différents selon l'association (vendeur pour CREE, participant — acheteur ou vendeur — pour PARTICIPE, expéditeur pour ENVOIE) : ce n'est pas des entités séparées, juste la même table vue sous différents rôles contextuels — conforme au cahier des charges ("Utilisateur authentifié : peut agir comme acheteur ou vendeur selon le contexte").

### Associations et cardinalités

- **UTILISATEUR (0,N) — CREE — (1,1) ANNONCE**
  Un utilisateur (vendeur) crée plusieurs annonces, ou aucune ; une annonce est créée par un seul utilisateur.

- **CATEGORIE (0,N) — APPARTIENT_A — (1,1) ANNONCE**
  Une catégorie classe plusieurs annonces (ou aucune) ; une annonce appartient à une seule catégorie.

- **STATUT (0,N) — CONCERNE — (1,1) ANNONCE**
  Un statut concerne plusieurs annonces (ou aucune) ; une annonce a un seul statut.

- **ANNONCE (0,N) — POSSEDE — (1,1) PHOTO**
  Une annonce peut avoir plusieurs photos (ou aucune) ; chaque photo illustre une seule annonce.

- **ANNONCE (0,N) — CONTIENT — (1,1) CONVERSATION**
  Une annonce peut avoir plusieurs conversations (une par acheteur intéressé) ; chaque conversation concerne une seule annonce.

- **UTILISATEUR (0,N) — PARTICIPE — (1,N) CONVERSATION**
  Un utilisateur participe à plusieurs conversations, ou aucune ; une conversation a au moins un participant (en pratique deux : l'acheteur et le vendeur).

- **CONVERSATION (1,N) — CONTENU — (1,1) MESSAGE**
  Une conversation contient un ou plusieurs messages ; chaque message appartient à une seule conversation.

- **UTILISATEUR (0,N) — ENVOIE — (1,1) MESSAGE**
  Un utilisateur envoie plusieurs messages, ou aucun ; chaque message est envoyé par un seul utilisateur.

### Schéma Mocodo


UTILISATEUR: _id_utilisateur, nom, prenom, email, mot_de_passe, code_postal
CATEGORIE: _id_categorie, nom
STATUT: _id_statut, nom
ANNONCE: _id_annonce, titre, description, prix, date_publication, date_suppression
PHOTO: _id_photo, url
CONVERSATION: _id_conversation, date_creation
MESSAGE: _id_message, contenu, date_envoi

CREE, 0N UTILISATEUR, 11 ANNONCE
APPARTIENT_A, 0N CATEGORIE, 11 ANNONCE
CONCERNE, 0N STATUT, 11 ANNONCE
POSSEDE, 0N ANNONCE, 11 PHOTO
CONTIENT, 0N ANNONCE, 11 CONVERSATION
PARTICIPE, 0N UTILISATEUR, 1N CONVERSATION
CONTENU, 1N CONVERSATION, 11 MESSAGE
ENVOIE, 0N UTILISATEUR, 11 MESSAGE

