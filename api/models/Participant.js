import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize-client.js";


const Participant = sequelize.define(
    "Participant",
    {
        conversationId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
    },
    { tableName: "participant", },

);

export default Participant;