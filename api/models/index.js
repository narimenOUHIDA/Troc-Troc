import Category from "./Category";
import Conversation from "./Conversation";
import Listing from "./Listing";
import Message from "./Message";
import Participant from "./Participant";
import Photo from "./Photo";
import PostalCode from "./PostalCode";
import Status from "./Status";
import User from "./User";



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
