// Load environnment variables from .env
import 'dotenv/config';
import cors from "cors";

// On importe notre package express
import express from 'express';

// Import local modules
import authRouter from './routes/auth.router.js';



import errorController from './controllers/ErrorController.js';

import { validateToken } from './middlewares/auth.middleware.js';


// Create Express app
const app = express();

// Pour parser le contenu des requetes en JSON
app.use(express.json());

//sert à autoriser ton frontend et ton backend à communiquer entre eux lorsqu’ils sont sur des origines différentes.
app.use(cors({ origin: 'http://localhost:5173' }));

app.use(authRouter);

// Route par défaut si aucune route n'a été trouvée
app.use(errorController.route404);

// Gestion des erreur
// Toutes les routes qui lancent une erreur gérées par ce controller
app.use(errorController.errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Troc troc app started at http://localhost:${PORT}`);
});
