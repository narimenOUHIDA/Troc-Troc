import Category from "./Category.js";
import Conversation from "./Conversation.js";
import Listing from "./Listing.js";
import Message from "./Message.js";
import Participant from "./Participant.js";
import Photo from "./Photo.js";
import PostalCode from "./PostalCode.js";
import Status from "./Status.js";
import User from "./User.js";

// Listing & Category

// 1 Listing appartient à 1 Category
Listing.belongsTo(
    Category, {
        foreignKey: "categoryId",
        as: "category"
    },
);
// 1 Category possede plusieurs Listing
Category.hasMany(Listing, {
    foreignKey: "categoryId",
    as: "listings"
});

// Listing & Status
Listing.belongsTo(
    Status, {
        foreignKey: "statusId",
        as: "status"
    },
);
Status.hasMany(Listing, {
    foreignKey: "statusId",
    as: "listings"
});

// Listing & User
Listing.belongsTo(
    User, {
        foreignKey: "userId",
        as: "user"
    },
);
User.hasMany(Listing, {
    foreignKey: "userId",
    as: "listings"
});

// ----------------------------- //

// Listing & Photo
Photo.belongsTo(
    Listing, {
        foreignKey: "listingId",
        as: "listing"
    },
);
Listing.hasMany(Photo, {
    foreignKey: "listingId",
    as: "photos"
});

// ----------------------------- //

// Listing & Conversation
// 1 Conversation appartient à 1 Listing
Conversation.belongsTo(
    Listing, {
        foreignKey: "listingId",
        as: "listing"
    },
);
// 1 Listing possede plusieurs Conversation
Listing.hasMany(Conversation, {
    foreignKey: "listingId",
    as: "conversations"
});

// ----------------------------- //

// User & PostalCode
User.belongsTo(PostalCode, {
        foreignKey: "postalCodeId",
        as: "PostalCode"
    },
);

PostalCode.hasMany(User, {
    foreignKey: "postalCodeId",
    as: "users"
});

// ----------------------------- //

// Conversation & Message
// 1 Message appartient à 1 Conversation
Message.belongsTo(Conversation, {
        foreignKey: "conversationId",
        as: "conversation"
    },
);

// 1 Conversation possede plusieurs Message
Conversation.hasMany(Message, {
    foreignKey: "conversationId",
    as: "messages"
});


// ----------------------------- //

// User & Message
// 1 Message appartient à 1 User
Message.belongsTo(User, {
        foreignKey: "userId",
        as: "user"
    },
);

// 1 User possede plusieurs Message
User.hasMany(Message, {
    foreignKey: "userId",
    as: "messages"
});


// ----------------------------- //

// User & Conversation
// 1 User appartient à plusieur Conversation
User.belongsToMany(Conversation, {
    through: Participant,
    foreignKey: "userId",
    otherKey: "conversationId",
    as: "conversations"
},
);

// 1 Conversation appartient à plusieur User
Conversation.belongsToMany(User, {
    through: Participant,
    foreignKey: "conversationId",
    otherKey: "userId",
    as: "users"
},
);

export { Category, Conversation, Listing, Message, Participant, Photo, PostalCode, Status, User };