
| Singulier      | Pluriel         |
| -------------- | --------------- |
| `Category`     | `Categories`    |
| `Status`       | `Statuses`      |
| `PostalCode`   | `PostalCodes`   |
| `User`         | `Users`         |
| `Listing`      | `Listings`      |
| `Photo`        | `Photos`        |
| `Conversation` | `Conversations` |
| `Message`      | `Messages`      |
| `Participant`  | `Participants`  |

// seed.js
import sequelize from "../models/sequelize-client.js";
import { Category, Conversation, Listing, Message, Participant, Photo, PostalCode, Status, User } from "../models/index.js";
import argon2 from "argon2";

// Import des json pour seed la BDD
import data from "./dataset.json" with { type: "json" };

async function seed() {
  try {
    // 1. on vérifie la synchronisation de la BDD
    console.log("Synchronisation de la BDD...");
    // On force la réinsertion des données en supprimant les tables avant des les recréer
    await sequelize.sync({ force: true });

    // 2. On envoie les datas en BDD
    // ⚠️ On doit toujours seeder les tables SANS relations AVANT les tables AVEC relations. Sinon, vous allez créer des problèmes dans les insertions de données qui ne pourront pas être faite, du fait de la non précense des id nécessaires pour les relations.
    // Category
    console.log("Seeding Category...");
    // On utilise la méthode "bulkCreate" de notre modèle qui permet d'insérer plusieurs lignes en BDD en simultané.
    const categories = await Category.bulkCreate(data.categories, { returning: true });

    // Status
    console.log("Seeding Status...");
    const statuses = await Status.bulkCreate(data.statuses, { returning: true });

    // PostalCode
    console.log("Seeding PostalCode...");
    const postalCodes = await PostalCode.bulkCreate(data.postalCodes, { returning: true });

    // Users 
    console.log("Seeding Users...");
    // data.users --> contient le tableau users déclaré dans JSON
    for (let userJson of data.users) { // parcours 1 à 1 tous les éléments du tableau users
      const hashMotDePasse = await argon2.hash(userJson.password); // calcul le hash du mot de passe
      userJson.password = hashMotDePasse; // remplace password par le hash du mot de passe
      // insérer user dans la BDD --> user contient 1 par 1 chaque élément du tableau 
      // on utiliser la modèle sequelize User et sa méthode static create pour insérer user dans la BDD
      await User.create(userJson);
    }

    // Listing
    console.log("Seeding Listing...");
    const listings = await Listing.bulkCreate(data.listings, { returning: true });

    let myUser;
    let myRole;

    for (let userRole of data.user_has_role) {
      // Première itération: userRole = { "user_id": 1, "role_id": 1 },
      myUser = await User.findByPk(userRole.user_id);

      if (!myUser) {
        throw new Error("⚠️ User not found: " + userRole.user_id);
      }

      myRole = await Role.findByPk(userRole.role_id);

      if (!myRole) {
        throw new Error("⚠️ Role not found: " + userRole.role_id);
      }

      // Insertion des users dans le tableau role sur la base de la relation hasMany établie dans index.js
      // 1 Role has many User --> 1 role a une liste de User
      // Ajoute myUser à la liste des User de myRole
      await myRole.addUser(myUser);
    }


    // Relation Card <-> Tag : on va lire card_has_tag du fichier JSON
    // C'est une liste, chaque élément contient deux valeurs : card_id = id de Card et tag_id = id de Tag
    // On va utiliser ces id pour rechercher les Card et les Tag dans la BDD puis les associer
    // C'est la manière la plus sûr de lier des Card et des Tag,
    // car on vérifie que Card et Tag existent bien avant de les mettre en relation

    // variables pour la boucle for
    let myCard;
    let myTag;

    // 1. Parcourir card_has_tag du JSON
    for (let cardTag of data.card_has_tag) {
      // cardTag contient card_id et tag_id

      // 2. rechercher Card dans la BDD à partir de cardTag.card_id
      myCard = await Card.findByPk(cardTag.card_id);

      // Si myCard est faux => pas trouvé dans la BDD, on arrête là
      if (!myCard) {
        throw new Error("⚠️ Card not found: " + cardTag.card_id);
      }

      // 3. rechercher Tag dans la BDD à partir de cardTag.tag_id
      myTag = await Tag.findByPk(cardTag.tag_id);

      // Si myTag pas trouvé dans la BDD ==> on arrête là
      if (!myTag) {
        throw new Error("⚠️ Tag not found: " + cardTag.tag_id);
      }

      // 4. myCard et myTag existent bien dans la BDD, on peut les associer
      await myCard.addTag(myTag);
    }

    // 3. On fermer la connection sequelize
    console.log("✅ Seeding complete!");
  } catch (error) {
    console.error("❌ Error synchronizing database : ", error);
  } finally {
    // Je pense à fermer la connexion à la fin de mon script
    await sequelize.close();
  }
}

seed();