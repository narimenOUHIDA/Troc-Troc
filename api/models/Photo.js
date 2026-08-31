import { DataTypes, INTEGER, Model } from "sequelize";
import sequelize from "./sequelize-client.js";

const Photo = sequelize.define(
    "Photo",
    {
        url: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        listingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "listing",
                key: "id",
            }
        },
    },
    { tableName: "photo", },

);

export default Photo;