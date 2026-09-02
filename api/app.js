// Load environnment variables from .env
import 'dotenv/config';

// On importe notre package express
import express from 'express';

// Create Express app
const app = express();

// Pour parser le contenu des requetes en JSON
app.use(express.json());

app.get('/', (req, res) => {
  // send() une méthode de l'objet réponse, qui permet d'envoyer à l'utilisateur du texte
  res.send('Hello World!');
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Troc troc app started at http://localhost:${PORT}`);
});
