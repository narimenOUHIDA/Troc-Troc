import HttpError from "../utils/HttpError.js";
import jwt from "jsonwebtoken";
import Joi from "joi"; // https://joi.dev/api/18.x.x
import { User } from "../models/index.js";

export function validateUser(req, res, next) {
    // 1. on utilise Joi pour valider le contenu du JSON body pour la requête
    // Définition du JSON attendu
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    // 3. s'il y a une erreur, on lance un exception qui sera capturée par le error controller
    if (error) {
        console.error(error.message);
        throw new HttpError("Email or password invalid", 400);
    }

    // Ici tout est ok, on passe au middleware suivant
    next();

};

export async function validateToken(req, res, next) {
    // 1. Dans l'entête de la requête HTTP, on attend ==> "Authorization": "Bearer <token>"
    // Donc, dans les entêtes de la requête, prendre la valeur de la clé "authorization"
    // Valeur attendue : "Bearer <token>"

    const bearerToken = req.headers.authorization;
    // 2. Vérifier que bearerToken n'est pas null et qu'il commence par la string "Bearer "
    if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
        throw new HttpError("Authorization token missing or invalid", 401);
    }

    // 3. bearerToken n'est pas null et commence par "Bearer "
    // Découper la string autour de l'espace " " et prendre la deuxième partie : tableau index 1
    // valeur attendue : le token ) vérifier
    const token = bearerToken.split(" ")[1];

    // 4. Utiliser JWT pour vérifier le token. Doc : https://www.npmjs.com/package/jsonwebtoken
    let tokenPayload;
    try {
        tokenPayload = jwt.verify(token, process.env.JWT_SECRET);

    } catch (error) {
        console.log(error);
        throw new HttpError("Authorization token missing or invalid", 401);
    }

    const user = await User.findByPk(tokenPayload.user_id, {
        attributes: ["id", "lastName", "firstName", "email", "postalCodeId", "registrationDate"]
    });

    if (!user) {
        throw new HttpError("User not found", 401); // 401 unauthorized
    }

    req.user = user;

    next();
}


export function validateRegister(req, res, next) {
    const schema = Joi.object({
        lastName: Joi.string().required(),
        firstName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
            .required(),
        //postalCodeId: Joi.number().integer().required(),
        postalCode: Joi.string()
            .pattern(/^\d{5}$/)
            .required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        console.error(error.message);
        throw new HttpError(error.details[0].message, 400);
        //error.details[0].message : renvoie l'erreur précise de Joi (ex: "firstName is required")
    }

    next();
};
