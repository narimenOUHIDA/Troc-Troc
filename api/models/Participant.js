import { DataTypes, Model } from "sequelize";
import sequelize from "./sequelize-client.js";


const Participant = sequelize.define(
    "Participant",
    {
        conversationId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "conversation",
                key: "id",
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "user",
                key: "id",
            }
        },
    },
    { tableName: "participant", },

);

export default Participant;