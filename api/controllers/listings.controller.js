import { Op } from "sequelize";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import {
  Listing,
  Category,
  Status,
  User,
  Photo,
  PostalCode,
} from "../models/index.js";
import { haversineDistanceKm } from "../utils/geo.js";
import HttpError from "../utils/HttpError.js";

// Rayon de recherche autour du code postal, en kilomètres (cf. cahier des charges)
const SEARCH_RADIUS_KM = 50;

const listingsQuerySchema = Joi.object({
  search: Joi.string().trim().max(255),
  categoryId: Joi.number().integer().positive(),
  postalCode: Joi.string().pattern(/^\d{5}$/),
});

// GET /api/v1/annonces?search=&categoryId=&postalCode=
export async function getListings(req, res) {
  const { error, value } = listingsQuerySchema.validate(req.query);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }

  const { search, categoryId, postalCode } = value;

  const where = { deletionDate: null };

  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  const userWhere = {};

  if (postalCode) {
    const origin = await PostalCode.findOne({ where: { postalCode } });

    // Code postal inconnu : personne ne peut être "à proximité"
    if (!origin || origin.latitude === null || origin.longitude === null) {
      return res.status(StatusCodes.OK).json({ data: [] });
    }

    const allPostalCodes = await PostalCode.findAll();
    const nearbyPostalCodeIds = allPostalCodes
      .filter((pc) => pc.latitude !== null && pc.longitude !== null)
      .filter(
        (pc) =>
          haversineDistanceKm(origin.latitude, origin.longitude, pc.latitude, pc.longitude) <=
          SEARCH_RADIUS_KM,
      )
      .map((pc) => pc.id);

    userWhere.postalCodeId = { [Op.in]: nearbyPostalCodeIds };
  }

  const listings = await Listing.findAll({
    where,
    include: [
      { model: Category, as: "category" },
      { model: Status, as: "status" },
      { model: Photo, as: "photos" },
      {
        model: User,
        as: "user",
        attributes: ["id", "firstName", "lastName"],
        where: Object.keys(userWhere).length ? userWhere : undefined,
        include: [{ model: PostalCode, as: "PostalCode" }],
      },
    ],
    order: [["publicationDate", "DESC"]],
  });

  return res.status(StatusCodes.OK).json({ data: listings });
}

export async function getListingById(req, res) {
  try {
    const listing = await Listing.findOne({
      where: {
        id: req.params.id,
        deletionDate: null,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName"],
          include: [
            {
              model: PostalCode,
              as: "PostalCode",
            },
          ],
        },
        {
          model: Category,
          as: "category",
        },
        {
          model: Status,
          as: "status",
        },
        {
          model: Photo,
          as: "photos",
        },
      ],
    });

    if (!listing) {
      throw new HttpError("Listing not found", 404);
    }

    return res.status(StatusCodes.OK).json({
      data: listing,
    });
  } catch (error) {
    console.log("Error while fetching listing:", error);

    throw new HttpError("Internal server error", 500);
  }
}

export async function createListing(req, res, next) {
  try {
    // 1. Récupérer les données autorisées du frontend
    const { title, description, price, categoryId } = req.body;
    // 2. Récupérer l'utilisateur connecté
    const userId = req.user.id

    // 3. Vérifier que la catégorie existe
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new HttpError("Catégorie introuvable", 404);
    }


    // 4. Récupérer le status "Disponible"
    const status = await Status.findByPk(1);
    if (!status) {
      throw new HttpError("Statut disponible introuvable", 500)
    }

    console.log("Données avant création :", {
      title,
      description,
      price,
      categoryId,
      statusId: status.id,
      userId
    });

    // Création de l'annonce
    const newListing = await Listing.create({
      title,
      description,
      price,
      categoryId,
      statusId: status.id,
      userId,
      publicationDate: new Date(),
    });

    console.log("ANNONCE CRÉÉE :", newListing);


    res.status(201).json(newListing);

  } catch (error) {
    console.error("ERREUR Listing.create :", error);
    throw new HttpError("Failed to create listing", 400);
  }
}

// Affichage de mes annonces
export async function getMyListings(req, res, next) {
  try {
    const myListings = await Listing.findAll({
      where: {
        userId: req.user.id,
        deletionDate: null,
      },
      include: [
        { model: Category, as: "category" },
        { model: Status, as: "status" },
        { model: Photo, as: "photos" },
      ],
    });

    console.log("Mes annonces :", myListings);
    res.status(200).json(myListings);

  } catch (error) {
    console.error("ERREUR my listings :", error);
    throw new HttpError("Failed to display my listings", 404);
  }

}

export async function updateListing() {

}

export async function deleteListing() {

}
