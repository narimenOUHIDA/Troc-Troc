import { Router } from "express";
import categoryController from "../controllers/CategoryController.js"

import { validateUser, validateToken, validateRegister } from '../middlewares/auth.middleware.js'

const router = Router();

router.get("/", validateRegister, categoryController.getCategories);

export default router;