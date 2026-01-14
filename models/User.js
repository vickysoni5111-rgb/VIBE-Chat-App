const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);










// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     // Yahan saari activity store hogi
//     likedPosts: [{ 
//         postId: String, 
//         img: String, 
//         caption: String, 
//         ownerName: String,
//         likedBy: String // Kisne like kiya uska naam
//     }],
//     comments: [{ 
//         postId: String, 
//         text: String, 
//         img: String, 
//         ownerName: String,
//         commentedBy: String 
//     }]
// }, { timestamps: true });

// module.exports = mongoose.model("User", UserSchema);