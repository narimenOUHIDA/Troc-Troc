import { User } from "../models/index.js";
import HttpError from "../utils/HttpError.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

class AuthController {

    registerUser = async (req, res, next) => {
        try {

            const {
                lastName,
                firstName,
                email,
                password,
                postalCodeId
            } = req.body; //recupére le body de la requete 

            // Chercher si le user existant dans BDD à partir de son email
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                // l'email exist déja , lancer une erreur 
                throw new HttpError("Email alredy exist", 409);
            }

            // Calculer le hash du mot de passe
            const hachedPassword = await argon2.hash(password);

            // Enregistrer l'utilisateur dans la BDD avec le mot de passe hashé
            const newUser = await User.create({
                lastName,
                firstName,
                email,
                password: hashedPassword,
                registrationDate: new Date(),
                postalCodeId
            });

            // 201 -> ressource created
            res.status(201).json({
                id: newUser.id,
                email: newUser.email,
            });

        } catch (error) {
            // attrape toutes les erreurs dans la fonction
            console.log(error.message);
            // lancer une erreur qui sera gérée par le errorController
            throw new HttpError("Failed create user", 400);
        }
    };

    login = async (req, res, next) => {

    };

    getMe = async (req, res, next) => {

    };
}

const authController = new AuthController();
export default authController;