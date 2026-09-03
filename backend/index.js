import express from 'express';
import db from './models/index.js';
import { Op } from 'sequelize';

const { Message } = db;
const app = express();
const port = 3000;

// Middleware pour parser le JSON dans les requêtes POST
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// --- ROUTES MESSAGERIE ---

// Récupérer les messages
app.get('/messages', async (req, res) => {
  try {
    const userId = req.user?.id || 1;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      order: [['createdAt', 'ASC']]
    });

    res.json(messages);
  } catch (error) {
    console.error('Erreur GET /messages:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages.' });
  }
});

// Envoyer un nouveau message
app.post('/messages', async (req, res) => {
  try {
    const sender_id = req.user?.id || 1;
    const { receiver_id, content, ad_id } = req.body;

    if (!content || !receiver_id) {
      return res.status(400).json({ error: 'Le contenu et le destinataire sont requis.' });
    }

    const newMessage = await Message.create({
      content,
      sender_id,
      receiver_id,
      ad_id: ad_id || null
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Erreur POST /messages:', error);
    res.status(500).json({ error: "Erreur lors de l'envoi du message." });
  }
});

// --- DÉMARRAGE DU SERVEUR  ---
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
