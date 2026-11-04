import { Router } from "express";
import {
  createConversation,
  getConversationById,
  getConversations,
} from "../controllers/conversations.controller.js";
import { createMessage, getConversationMessages } from "../controllers/messages.controller.js";

const router = Router();

router.get("/", getConversations);
router.post("/", createConversation);
router.get("/:id", getConversationById);

router.get("/:conversationId/messages", getConversationMessages);
router.post("/:conversationId/messages", createMessage);

export default router;
