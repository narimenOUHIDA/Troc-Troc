import { Router } from "express";
import { getListings } from "../controllers/listings.controller.js";

const router = Router();

router.get("/", getListings);

export default router;
