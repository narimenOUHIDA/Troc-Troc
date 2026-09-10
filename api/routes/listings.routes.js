import { Router } from "express";
import { getListings, getMyListings, getListingById, createListing, updateListing, deleteListing } from "../controllers/listings.controller.js";
import { validateToken } from '../middlewares/auth.middleware.js';
import { createListingSchema } from '../middlewares/listings.middleware.js';


const router = Router();

router.get("/", getListings);

router.get("/mes-annonces", validateToken, getMyListings);

router.get("/:id ", getListingById);

router.post("/", validateToken, createListingSchema, createListing);

router.patch("/:id ", updateListing);

router.delete("/:id ", deleteListing);

export default router;
