// Load environnment variables from .env
import 'dotenv/config';

// On importe notre package express
import express from 'express';
import { StatusCodes } from 'http-status-codes';

import listingsRouter from './routes/listings.routes.js';

// Create Express app
const app = express();

// Pour parser le contenu des requetes en JSON
app.use(express.json());

app.get('/', (req, res) => {
  // send() une méthode de l'objet réponse, qui permet d'envoyer à l'utilisateur du texte
  res.send('Hello World!');
});

app.use('/api/v1/annonces', listingsRouter);

// Gestionnaire d'erreurs centralisé : renvoie du JSON plutôt que la page HTML par défaut d'Express
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: err.message || 'Erreur interne du serveur' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Troc troc app started at http://localhost:${PORT}`);
});
