import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { Conversation, Listing, Message, Participant, User } from "../models/index.js";

// NOTE: pas encore d'authentification (feat/auth-api pas mergée) : userId est
// passé explicitement par le client en attendant un vrai middleware JWT/req.user.

const listConversationsQuerySchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
});

const createConversationSchema = Joi.object({
  listingId: Joi.number().integer().positive().required(),
  userId: Joi.number().integer().positive().required(),
});

// GET /api/v1/conversations?userId=
// US15 — conversations où l'utilisateur figure comme participant (via la table PARTICIPE).
export async function getConversations(req, res) {
  const { error, value } = listConversationsQuerySchema.validate(req.query);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }

  const user = await User.findByPk(value.userId, {
    include: [
      {
        model: Conversation,
        as: "conversations",
        through: { attributes: [] },
        include: [{ model: Listing, as: "listing" }],
      },
    ],
  });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Utilisateur introuvable" });
  }

  return res.status(StatusCodes.OK).json({ data: user.conversations });
}

// GET /api/v1/conversations/:id?userId=
// US16 — messages d'une conversation (l'utilisateur doit en être participant).
export async function getConversationById(req, res) {
  const { error, value } = listConversationsQuerySchema.validate(req.query);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }

  const conversation = await Conversation.findByPk(req.params.id, {
    include: [
      { model: Listing, as: "listing" },
      {
        model: User,
        as: "users",
        through: { attributes: [] },
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Message,
        as: "messages",
        include: [{ model: User, as: "user", attributes: ["id", "firstName", "lastName"] }],
        separate: true,
        order: [["sentAt", "ASC"]],
      },
    ],
  });

  if (!conversation) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Conversation introuvable" });
  }

  const isParticipant = await Participant.findOne({
    where: { conversationId: conversation.id, userId: value.userId },
  });

  if (!isParticipant) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: "Vous ne participez pas à cette conversation" });
  }

  return res.status(StatusCodes.OK).json({ data: conversation });
}

// POST /api/v1/conversations
// US13 — démarrer une conversation acheteur/vendeur à partir d'une annonce.
export async function createConversation(req, res) {
  const { error, value } = createConversationSchema.validate(req.body);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }

  const { listingId, userId } = value;

  const listing = await Listing.findByPk(listingId);

  if (!listing) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Annonce introuvable" });
  }

  if (listing.userId === userId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Vous ne pouvez pas démarrer une conversation sur votre propre annonce" });
  }

  // Une conversation existe déjà entre cet acheteur et cette annonce : on la réutilise.
  const participantRows = await Participant.findAll({ where: { userId }, attributes: ["conversationId"] });
  const existingConversation = await Conversation.findOne({
    where: { listingId, id: participantRows.map((row) => row.conversationId) },
  });

  if (existingConversation) {
    return res.status(StatusCodes.OK).json({ data: existingConversation });
  }

  const conversation = await Conversation.create({
    listingId,
    name: listing.title,
    creationDate: new Date(),
  });

  await Participant.bulkCreate([
    { conversationId: conversation.id, userId },
    { conversationId: conversation.id, userId: listing.userId },
  ]);

  return res.status(StatusCodes.CREATED).json({ data: conversation });
}
