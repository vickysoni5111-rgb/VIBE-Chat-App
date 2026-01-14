const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: { type: Array }, // Isme [senderId, receiverId] save honge
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);