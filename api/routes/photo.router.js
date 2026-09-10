import { Router } from "express";
import multer from "multer";
import photoController from "../controllers/PhotoController.js"

const router = Router();

const upload = multer({ dest: "uploads/listings/" });

router.post("/", upload.single('uploaded_file'), photoController.uploadPhotos);

export default router;