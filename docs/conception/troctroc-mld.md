# TrocTroc — MLD (Modèle Logique de Données)

Dérivé du [MCD](troctroc-user-stories-mcd.md), aligné sur le cahier des charges officiel. Règle appliquée : dans une association (1,N)/(1,1), la clé étrangère est placée du côté (1,1), en référence à la clé primaire du côté (1,N). Une association (0,N)/(1,N) (plusieurs-à-plusieurs) donne lieu à une table de jointure portant les deux clés étrangères.

## Historique des ajustements

**Version initiale** — comparaison avec le cahier des charges officiel :
- **`PARTICIPE` supprimée.** Une conversation ne relie pas un groupe libre d'utilisateurs : elle se déclenche "à partir d'une annonce" par un acheteur (US13). Le vendeur se déduit déjà via `ANNONCE.id_utilisateur` ; il ne reste donc qu'à identifier l'acheteur. `CONVERSATION` porte directement `#id_acheteur` (FK vers UTILISATEUR) : plus besoin de table de jointure.
- **`id_expediteur` ajouté à `MESSAGE`.** Une conversation implique 2 personnes (acheteur et vendeur) ; sans cette FK, impossible de savoir qui a écrit quel message.

**Mise à jour du 26/08/2026** — suite à un nouveau MCD fourni par l'équipe :
- **`STATUT` extraite en entité propre**, au lieu d'un champ texte `statut` sur `ANNONCE` : `ANNONCE` porte désormais `#id_statut`.
- **Sur `ANNONCE`** : `date_creation` renommée `date_publication`, et `date_suppression` ajoutée (suppression douce / soft delete — `NULL` tant que l'annonce n'est pas supprimée).
- **`PARTICIPE` réintroduite** entre `UTILISATEUR` et `CONVERSATION` (relation 0,N / 1,N) : la table de jointure revient, avec `#id_utilisateur` et `#id_conversation` en clé primaire composite. `CONVERSATION` ne porte donc plus `#id_acheteur` en direct.
  ⚠️ Ceci annule l'ajustement de la version initiale ci-dessus, qui supprimait cette table de jointure — à confirmer en équipe : sans elle, acheteur et vendeur étaient déjà identifiables (acheteur via `id_acheteur`, vendeur déduit via `ANNONCE.id_utilisateur`), donc `PARTICIPE` ajoute de la flexibilité (plusieurs participants) mais aussi une jointure en plus pour les cas simples.
- **Statuts à confirmer** : le nouveau MCD donne "active, supprimée" comme exemples de valeurs pour `STATUT.nom`, mais le cahier des charges exige un état "vendu" (US21) — et `date_suppression` couvre déjà la suppression. À trancher en équipe : les valeurs réelles de `STATUT` (`disponible` / `vendu` semblent nécessaires ; `supprimée` fait peut-être doublon avec `date_suppression`).

**Mise à jour du 01/09/2026** — suite au [MCD.pdf](MCD.pdf) déposé dans le dépôt :
- **`CODE_POSTAL` créée en entité propre.** `code_postal` n'est plus un simple attribut texte sur `UTILISATEUR` : `UTILISATEUR` porte désormais `#code_postal` (FK, côté (1,1) de l'association `HABITE`), en référence à `CODE_POSTAL (_code_postal_, ville, latitude, longitude)`. Objectif : permettre un vrai calcul de distance (US07/US09, rayon de 50 km) via `latitude`/`longitude`, au lieu d'un simple filtre texte sur le code postal.
- **`PHOTO.ordre` ajouté.** Position d'affichage de la photo dans la galerie d'une annonce (0 = photo principale, US11/US12).
- **`MESSAGE.lu` ajouté.** Marque si le message a été lu par son destinataire (pastille de message non lu, US15 — voir [wireframes](troctroc-wireframes.md#éléments-transverses)).
- **Association `UTILISATEUR`–`ANNONCE` renommée `CREE` → `PUBLIE`**, pour coller au libellé du MCD fourni. Aucun changement de cardinalité ni de clé.
- **Cardinalité `ANNONCE` de `POSSEDE` resserrée de `(0,N)` à `(1,N)`** : une annonce doit désormais avoir au moins une photo (elle pouvait auparavant n'en avoir aucune). N'affecte pas le schéma de clés ci-dessous (la FK reste sur `PHOTO`), seulement la contrainte métier (validation applicative/formulaire de dépôt, US05/US06).

Convention : `_souligné_` = clé primaire, `#` = clé étrangère.

```
STATUT (_id_statut_, nom)

CATEGORIE (_id_categorie_, nom)

CODE_POSTAL (_code_postal_, ville, latitude, longitude)

UTILISATEUR (_id_utilisateur_, nom, prenom, email, mot_de_passe, #code_postal)

ANNONCE (_id_annonce_, titre, description, prix, date_publication, date_suppression, #id_utilisateur, #id_categorie, #id_statut)

PHOTO (_id_photo_, url, ordre, #id_annonce)

CONVERSATION (_id_conversation_, date_creation, #id_annonce)

PARTICIPE (_#id_utilisateur_, _#id_conversation_)

MESSAGE (_id_message_, contenu, date_envoi, lu, #id_conversation, #id_expediteur)
```

## Détail des clés étrangères

| Table | Clé étrangère | Référence | Association d'origine | Rôle |
|---|---|---|---|---|
| UTILISATEUR | code_postal | CODE_POSTAL.code_postal | HABITE | — |
| ANNONCE | id_utilisateur | UTILISATEUR.id_utilisateur | PUBLIE | vendeur |
| ANNONCE | id_categorie | CATEGORIE.id_categorie | APPARTIENT_A | — |
| ANNONCE | id_statut | STATUT.id_statut | CONCERNE | — |
| PHOTO | id_annonce | ANNONCE.id_annonce | POSSEDE | — |
| CONVERSATION | id_annonce | ANNONCE.id_annonce | CONTIENT | — |
| PARTICIPE | id_utilisateur | UTILISATEUR.id_utilisateur | PARTICIPE | acheteur ou vendeur |
| PARTICIPE | id_conversation | CONVERSATION.id_conversation | PARTICIPE | — |
| MESSAGE | id_conversation | CONVERSATION.id_conversation | CONTENU | — |
| MESSAGE | id_expediteur | UTILISATEUR.id_utilisateur | ENVOIE | expéditeur (acheteur ou vendeur) |

Dans la pratique, une conversation a exactement deux participants (l'acheteur et le vendeur), même si le modèle autorise plus largement (1,N). Le vendeur reste par ailleurs déductible via `CONVERSATION.id_annonce → ANNONCE.id_utilisateur`.
