// On importe notre package express
import express from 'express';

const app = express();

const port = 3000;

app.get('/', (req, res) => {
  // send() une méthode de l'objet réponse, qui permet d'envoyer à l'utilisateur du texte
  res.send('Hello World!');
});

// on lance le serveur, en écoutant sur le port (3000)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
