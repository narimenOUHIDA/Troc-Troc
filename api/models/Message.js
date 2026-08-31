import { DataTypes, INTEGER, Model } from "sequelize";
import sequelize from "./sequelize-client.js";

const Message = sequelize.define(
    "Message",
    {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        sentAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        conversationId: {
            type: DataTypes.INTEGER,
            references: {
                model: "conversation",
                key: "id",
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: "user",
                key: "id",
            }
        },
    },
    { tableName: "message", },

);

export default Message;