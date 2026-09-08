import { Router } from "express";
import { getListings, getListingById, createListing, updateListing, deleteListing } from "../controllers/listings.controller.js";
import { validateToken } from '../middlewares/auth.middleware.js';
import { createListingSchema } from '../middlewares/listings.middleware.js';


const router = Router();

router.get("/", getListings);
router.get("/listingsList", getListings);

router.get("/listings/:id ", getListingById);

router.post("/listings", validateToken, createListingSchema, createListing);

router.patch("/listings/:id ", updateListing);

router.delete("/listings/:id ", deleteListing);

export default router;
