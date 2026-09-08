import { Result } from "pg";
import { Category } from "../models/index.js";
import HttpError from "../utils/HttpError.js";

class CategoryController {

    getCategories = async (req, res, next) => {
        try {
            const categories = await Category.findAll();
            res.status(200).json(categories)
            console.log("this is ", categories)
        } catch (error) {
            throw new HttpError("Not found", 404)
        }
    }
}

const categoryController = new CategoryController();
export default categoryController;

