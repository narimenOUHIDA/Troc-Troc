// Fichier pour synchroniser les classes du modèle (JS)
// Avec les données dans la BDD
// La BDD est construite à partir des données fournient en JS dans le modèle

// Une fois que le fichier est crée, il n'y a plus besoin d'un toucher ;)

import "dotenv/config";
import sequelize from "../models/sequelize-client.js";
import "../models/index.js"; // Important: importe les modèles pour qu'ils soient connus de Sequelize

// Fonction pour synchroniser les données du Modèle dans la BDD
async function syncDb() {
  try {
    // L'option { alter: true } compare l'état actuel de la DB avec les modèles et applique les changements.
    // C'est utile en développement, mais dangereux en production !
    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized successfully!");
  } catch (error) {
    console.error("❌ Error synchronizing the database:", error);
  } finally {
    // Une fois l'opération terminée, on ferme la connexion à la BDD
    await sequelize.close();
  }
}

// Appel de la fonction pour synchrniser la BDD
syncDb();

// Il suffit d'executer la commande "node ./models/sequelize/sync.js" pour synchronier la BDD