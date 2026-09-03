import { Router } from "express";
import authController from "../controllers/AuthController.js"
import { validateUser, validateToken } from '../middlewares/auth.middleware.js'

const router = Router();

router.post("/auth/register/", validateUser, authController.registerUser )

router.post("auth/login", validateUser, authController.login)

router.get("auth/me", validateToken, authController.getMe)