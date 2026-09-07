import { DataTypes } from "sequelize";
import sequelize from "./sequelize-client.js";

const Listing = sequelize.define(
    "Listing",
    {
        title : {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description : {
            type: DataTypes.TEXT,
        },
        price : {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        publicationDate : {
            type: DataTypes.DATE,
            allowNull: false,
        },
        deletionDate : {
            type: DataTypes.DATE,
        },
        categoryId : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        statusId : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    { tableName: "listing", },

);

export default Listing;