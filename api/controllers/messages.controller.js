import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { Conversation, Message, Participant, User } from "../models/index.js";

const createMessageSchema = Joi.object({
  content: Joi.string().trim().min(1).required(),
});

// vérification de la conversation s'il existe et si l'utilisateur connecté en est participant.
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

// US16 — consulter les messages d'une conversation.
export async function getConversationMessages(req, res) {

  const { conversationId } = req.params;

  const forbidden = await ensureParticipant(conversationId, req.user.id);

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
  const { content } = value;

  const userId = req.user.id;

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
