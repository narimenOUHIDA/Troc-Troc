import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize-client.js";


const Category = sequelize.define(
    "Category",
    {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    { tableName: "category", },

);

export default Category;