import { DataTypes, INTEGER, Model } from "sequelize";
import sequelize from "./sequelize-client.js";

const Conversation = sequelize.define(
    "Conversation",
    {
        name: {
            type: DataTypes.STRING(100),
        },

        creationDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        listingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    { tableName: "conversation", },

);

export default Conversation;