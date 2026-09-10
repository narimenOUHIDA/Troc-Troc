import { url } from "zod";
import { Photo } from "../models/index.js";
import HttpError from "../utils/HttpError.js";

class PhotoController {
    uploadPhotos = async (req, res, next) => {
        try {
            console.log("FILE :", req.file);
            console.log("BODY", req.body);

            if (!req.file) {
                throw new HttpError("Aucune photo envoyée", 400);
            }

            const { listingId, order } = res.body;

            if (!listingId) {
                throw new HttpError("listingId manquant", 400);
            }

            const photo = await Photo.create({
                url: req.file.path,
                order: Number(order) || 1,
                listingId: Number(listingId),
            })

            res.status(201).json({ photo });

        } catch (error) {
            console.error("ERREUR uploadPhotos :", error);
            throw new HttpError("Upload failed", 500)
        }
    }
}

const photoController = new PhotoController();
export default photoController;

