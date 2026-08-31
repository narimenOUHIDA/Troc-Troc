import { DataTypes, INTEGER, Model } from "sequelize";
import sequelize from "./sequelize-client.js";


const Status = sequelize.define(
    "Status",
    {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    { tableName: "status", },

);

export default Status;