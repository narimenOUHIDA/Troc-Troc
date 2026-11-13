import { Router } from "express";
import { getListings, getMyListings, findAllListings, getListingById, createListing, updateListing, deleteListing } from "../controllers/listings.controller.js";
import { validateToken } from '../middlewares/auth.middleware.js';
import { createListingSchema } from '../middlewares/listings.middleware.js';


const router = Router();


router.get("/", getListings);

router.get("/allListings", findAllListings);

router.get("/mes-annonces", validateToken, getMyListings);

router.get("/:id", getListingById);

router.post("/", validateToken, createListingSchema, createListing);

router.patch("/:id", validateToken, updateListing);

router.delete("/:id", validateToken, deleteListing);

export default router;
