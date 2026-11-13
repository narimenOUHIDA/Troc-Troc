import { Router } from "express";
import {
  createConversation,
  getConversationById,
  getConversations,
} from "../controllers/conversations.controller.js";
import { createMessage, getConversationMessages } from "../controllers/messages.controller.js";
import { validateToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(validateToken);  // appliquer le validateToken middlewares une seul fois sur toute les routes

router.get("/", getConversations);
router.post("/", createConversation);
router.get("/:id", getConversationById);

router.get("/:conversationId/messages", getConversationMessages);
router.post("/:conversationId/messages", createMessage);

export default router;
