import { DataTypes } from "sequelize";
import sequelize from "./sequelize-client.js";

const Photo = sequelize.define(
    "Photo",
    {
        url: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        listingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    { tableName: "photo", },

);

export default Photo;