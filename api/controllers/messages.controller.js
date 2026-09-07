import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { Conversation, Message, Participant, User } from "../models/index.js";

// NOTE: pas encore d'authentification (feat/auth-api pas mergée) : userId est
// passé explicitement par le client en attendant un vrai middleware JWT/req.user.

const listMessagesQuerySchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
});

const createMessageSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  content: Joi.string().trim().min(1).required(),
});

async function ensureParticipant(conversationId, userId) {
  const conversation = await Conversation.findByPk(conversationId);

  if (!conversation) {
    return { status: StatusCodes.NOT_FOUND, message: "Conversation introuvable" };
  }

  const participant = await Participant.findOne({ where: { conversationId, userId } });

  if (!participant) {
    return { status: StatusCodes.FORBIDDEN, message: "Vous ne participez pas à cette conversation" };
  }

  return null;
}

// GET /api/v1/conversations/:conversationId/messages?userId=
// US16 — consulter les messages d'une conversation.
export async function getConversationMessages(req, res) {
  const { error, value } = listMessagesQuerySchema.validate(req.query);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }

  const { conversationId } = req.params;

  const forbidden = await ensureParticipant(conversationId, value.userId);

  if (forbidden) {
    return res.status(forbidden.status).json({ message: forbidden.message });
  }

  const messages = await Message.findAll({
    where: { conversationId },
    include: [{ model: User, as: "user", attributes: ["id", "firstName", "lastName"] }],
    order: [["sentAt", "ASC"]],
  });

  return res.status(StatusCodes.OK).json({ data: messages });
}

// POST /api/v1/conversations/:conversationId/messages
// US14 / US17 — envoyer un message (démarrer ou poursuivre l'échange).
export async function createMessage(req, res) {
  const { error, value } = createMessageSchema.validate(req.body);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }

  const { conversationId } = req.params;
  const { userId, content } = value;

  const forbidden = await ensureParticipant(conversationId, userId);

  if (forbidden) {
    return res.status(forbidden.status).json({ message: forbidden.message });
  }

  const message = await Message.create({
    conversationId,
    userId,
    content,
    sentAt: new Date(),
    isRead: false,
  });

  return res.status(StatusCodes.CREATED).json({ data: message });
}
