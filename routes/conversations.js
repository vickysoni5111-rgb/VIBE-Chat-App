

const router = require("express").Router();
const Conversation = require("../models/Conversation");

// Naya conversation (Duplicate check ke saath)
router.post("/", async (req, res) => {
  try {
    // Check agar in dono ke beech pehle se conversation hai
    const existingChat = await Conversation.findOne({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });

    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// User ke saare contacts lana
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;


