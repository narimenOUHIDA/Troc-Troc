import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { Op, fn, col } from "sequelize";
import { Conversation, Listing, Message, Participant, User } from "../models/index.js";



const createConversationSchema = Joi.object({
  listingId: Joi.number().integer().positive().required(),
});


// US15 — conversations où l'utilisateur figure comme participant (via la table PARTICIPE).
export async function getConversations(req, res) {

  const user = await User.findByPk(req.user.id, {
    include: [
      {
        model: Conversation,
        as: "conversations",
        through: { attributes: [] },
        include: [
          { model: Listing, as: "listing" },
          { model: User, as: "users", through: { attributes: [] }, attributes: ["id", "firstName", "lastName"] },
          { model: Message, as: "messages", separate: true, order: [["sentAt", "DESC"]], limit: 1 },
        ],
      },
    ],
  });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Utilisateur introuvable" });
  }

  const conversationIds = user.conversations.map((conversation) => conversation.id);

  // Nombre de messages non lus envoyés par l'autre participant, groupés par conversation.
  const unreadRows = await Message.findAll({
    attributes: ["conversationId", [fn("COUNT", col("id")), "unreadCount"]],
    where: { conversationId: conversationIds, userId: { [Op.ne]: req.user.id }, isRead: false },
    group: ["conversationId"],
    raw: true,
  });
  const unreadByConversation = Object.fromEntries(
    unreadRows.map((row) => [row.conversationId, Number(row.unreadCount)]),
  );

  const conversations = user.conversations.map((conversation) => ({
    ...conversation.toJSON(),
    unreadCount: unreadByConversation[conversation.id] ?? 0,
  }));

  return res.status(StatusCodes.OK).json({ data: conversations });
}

// GET /api/v1/conversations/:id
// US16 — messages d'une conversation (l'utilisateur doit en être participant).
export async function getConversationById(req, res) {

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

  //empêche un utilisateur connecté de consulter une conversation à laquelle il ne participe pas.
  const isParticipant = await Participant.findOne({
    where: { conversationId: conversation.id, userId: req.user.id },
  });

  if (!isParticipant) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: "Vous ne participez pas à cette conversation" });
  }

  // On consulte la conversation : les messages de l'autre participant passent en "lu".
  await Message.update(
    { isRead: true },
    { where: { conversationId: conversation.id, userId: { [Op.ne]: req.user.id }, isRead: false } },
  );

  return res.status(StatusCodes.OK).json({ data: conversation });
}

// POST /api/v1/conversations
// US13 — démarrer une conversation acheteur/vendeur à partir d'une annonce.
export async function createConversation(req, res) {
  const { error, value } = createConversationSchema.validate(req.body);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }

  const userId = req.user.id

  const { listingId } = value;

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
