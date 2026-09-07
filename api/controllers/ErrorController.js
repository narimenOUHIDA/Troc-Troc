import HttpError from "../utils/HttpError.js";

class ErrorController {
    errorHandler = async (err, req, res, next) => {

        // instanceof : est-ce que err est une instance de HttpError ?
        // retourne un bool vrai si err est une instance de HttpError
        if (err instanceof HttpError) {
            // return pour quitter la fonction ici
            return res.status(err.statusCode).json({
                status: "error",
                statusCode: err.statusCode, // statusCode est spécifique à HttpError
                message: err.message,
            });
        }

        // Si err n'est pas une HttpError, c'est probablement une erreur Sequelize
        // donc on renvoie une erreur 500 générique
        res.status(500).json({
            status: "error",
            statusCode: 500,
            // si err.parent existe: récupérer le message du parent --> err.parent?.message
            // dans le cas d'une erreur SQL err.parent.message contient l'erreur SQL
            // si err.parent n'existe pas, alors récupérer le message de err --> ?? err.message
            message: "Internal Server Error: " + (err.parent?.message ?? err.message),
        });
    };

    // aucune route trouvée, on lance une erreur
    route404 = async (req, res, next) => {
        throw new HttpError("Route Not Found", 404);
    };
}

export default new ErrorController();