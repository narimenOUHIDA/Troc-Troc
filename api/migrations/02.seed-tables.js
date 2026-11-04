
// seed.js
import sequelize from "../models/sequelize-client.js";
import { Category, Conversation, Listing, Message, Participant, Photo, PostalCode, Status, User } from "../models/index.js";
import argon2 from "argon2";

// Import des json pour seed la BDD
import data from "./dataset.json" with { type: "json" };

async function seed() {
  try {
    console.log("Synchronisation de la BDD...");
    // On force la réinsertion des données en supprimant les tables avant des les recréer
    await sequelize.sync({ force: true });

    // 2. On envoie les datas en BDD
    // ⚠️ On doit toujours seeder les tables SANS relations AVANT les tables AVEC relations. Sinon, vous allez créer des problèmes dans les insertions de données qui ne pourront pas être faite, du fait de la non précense des id nécessaires pour les relations.
    // Category
    console.log("Seeding Category...");
    // On utilise la méthode "bulkCreate" de notre modèle qui permet d'insérer plusieurs lignes en BDD en simultané.
    const categories = await Category.bulkCreate(data.categories, { validate: true, returning: true });

    // Status
    console.log("Seeding Status...");
    const statuses = await Status.bulkCreate(data.statuses, { validate: true, returning: true });

    // PostalCode
    console.log("Seeding PostalCode...");
    const postalCodes = await PostalCode.bulkCreate(data.postalCodes, { validate: true,  returning: true });

    // Users à verifier 
    console.log("Seeding Users...");
    // data.users --> contient le tableau users déclaré dans JSON
    for (let userJson of data.users) { // parcours 1 à 1 tous les éléments du tableau users
      const user = {
        ...userJson,
        password: await argon2.hash(userJson.password)
      };

      await User.create(user);
    }

    // Listing
    console.log("Seeding Listing...");
    const listings = await Listing.bulkCreate(data.listings, { validate: true,  returning: true });

    // Photo
    console.log("Seeding Photo...");
    const photos = await Photo.bulkCreate(data.photos, { validate: true,  returning: true });

    // Conversation
    console.log("Seeding Conversation...");
    const conversations = await Conversation.bulkCreate(data.conversations, { validate: true, returning: true });

    // Message
    console.log("Seeding Message...");
    const messages = await Message.bulkCreate(data.messages, { validate: true,  returning: true });

    // Participant
    console.log("Seeding Participant...");
    const participants = await Participant.bulkCreate(data.participants, { validate: true,  returning: true });

    // Resynchronisation des séquences PostgreSQL : le dataset fournit des id explicites,
    // donc les séquences "id" de chaque table restent à 1 et la prochaine création via
    // l'API (Sequelize, id auto) entre en conflit avec un id déjà pris par le seed.
    console.log("Resynchronisation des séquences...");
    const tablesWithSerialId = ["category", "status", "postalCode", "user", "listing", "photo", "conversation", "message"];

    for (const table of tablesWithSerialId) {
      await sequelize.query(
        `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), COALESCE((SELECT MAX(id) FROM "${table}"), 1))`
      );
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