import { DataTypes } from "sequelize";
import sequelize from "./sequelize-client.js";

const PostalCode = sequelize.define(
    "PostalCode",
    {
        postalCode: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DECIMAL(9,6),
        },
        longitude: {
            type: DataTypes.DECIMAL(9,6),
        },

    },
    { tableName: "postalCode", },

);

export default PostalCode;