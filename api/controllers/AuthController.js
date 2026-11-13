import { User, PostalCode } from "../models/index.js";
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
                postalCode
            } = req.body; //recupére le body de la requete 

            // Chercher si le user existant dans BDD à partir de son email
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                // l'email exist déja , lancer une erreur 
                throw new HttpError("Email alredy exist", 409);
            }

            // Calculer le hash du mot de passe
            const hachedPassword = await argon2.hash(password);

            const location = await PostalCode.findOne({
                where: { postalCode }
            });

            if (!location) {
                throw new HttpError("Code postal non pris en charge", 400);
            }

            // Enregistrer l'utilisateur dans la BDD avec le mot de passe hashé
            const newUser = await User.create({
                lastName,
                firstName,
                email,
                password: hachedPassword,
                registrationDate: new Date(),
                postalCodeId: location.id
            });

            // 201 -> ressource created
            res.status(201).json({
                id: newUser.id,
                lastName: newUser.lastName,
                firstName: newUser.firstName,
                email: newUser.email,
                registrationDate: newUser.registrationDate,
                postalCodeId: newUser.postalCodeId,
            });

        } catch (error) {
            // attrape toutes les erreurs dans la fonction
            console.log(error.message);

            if (error instanceof HttpError) throw error;
            // lancer une erreur qui sera gérée par le errorController
            throw new HttpError("Failed create user", 400);
        }
    };

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // 1. vérifier si l'utilisateur existe dans la BDD (chercher par son email)
            const foundUser = await User.findOne({ where: { email } });
            if (!foundUser) {
                throw new HttpError("user not found", 401);
            }

            // 2. vérifier si son password est valide (correspondance entre son password et le hash stocké en BDD)
            if (!(await argon2.verify(foundUser.password, password))) {
                throw new HttpError("Invalid credentials", 401)
            }

            // 3. calculer un token JWT
            const token = jwt.sign(
                { user_id: foundUser.id },
                process.env.JWT_SECRET,
                { expiresIn: "24h" },
            );

            res.status(200).json({
                token,
                user: {
                    id: foundUser.id,
                    firstName: foundUser.firstName,
                    lastName: foundUser.lastName,
                    email: foundUser.email,
                }
            })

        } catch (error) {
            console.log(error.message);
            if (error instanceof HttpError) throw error;
            throw new HttpError("Failed to login", 401); //unauthorized
        }
    };

    getMe = async (req, res, next) => {
        try {
            res.status(200).json({
                id: req.user.id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                registrationDate: req.user.registrationDate
            })

        } catch (error) {
            throw new HttpError("user not founnded", 404)
        }
    };
}

const authController = new AuthController();

export default authController;