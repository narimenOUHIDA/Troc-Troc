import { DataTypes } from "sequelize";
import sequelize from "./sequelize-client.js";

const User = sequelize.define(
    "User",
    {
        lastName : {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        firstName : {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email : {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        password : {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        registrationDate : {
            type: DataTypes.DATE,
            allowNull: false,
        },
        postalCodeId : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    { tableName: "user", },

);

export default User;