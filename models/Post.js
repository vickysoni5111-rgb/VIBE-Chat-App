const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  caption: { type: String },
  img: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);