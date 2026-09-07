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
