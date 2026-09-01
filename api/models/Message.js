import { DataTypes } from "sequelize";
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
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    { tableName: "message", },

);

export default Message;