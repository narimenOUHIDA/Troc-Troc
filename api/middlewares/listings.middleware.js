import Joi from "joi";
import HttpError from "../utils/HttpError.js";

export function createListingSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().trim().max(255).required(),

        description: Joi.string()
            .allow("")
            .max(5000),

        price: Joi.number()
            .positive()
            .required(),

        categoryId: Joi.number()
            .integer()
            .positive()
            .required()
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        throw new HttpError(error.details[0].message, 400);
    }

    // On remplace req.body par les données validées
    req.body = value;

    next();
}