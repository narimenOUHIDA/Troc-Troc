import { DataTypes, Model } from "sequelize";
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
            references: {
                model: "category",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        statusId : {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "status",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        userId : {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
    },
    { tableName: "listing", },

);

export default Listing;