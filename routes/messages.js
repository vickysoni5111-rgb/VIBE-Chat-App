
// const router = require("express").Router();
// const Message = require("../models/Message");

// // Message save karna (Isme createdAt apne aap save hoga)
// router.post("/", async (req, res) => {
//   const newMessage = new Message(req.body);
//   try {
//     const savedMessage = await newMessage.save();
//     res.status(200).json(savedMessage);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // Purani chat nikalna
// router.get("/:conversationId", async (req, res) => {
//   try {
//     const messages = await Message.find({
//       conversationId: req.params.conversationId,
//     });
//     res.status(200).json(messages);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// module.exports = router;


const router = require("express").Router();
const Message = require("../models/Message");

// Message save karna (Seen default: false)
router.post("/", async (req, res) => {
  const newMessage = new Message({
      ...req.body,
      seen: false // Shuruat mein unseen hoga
  });
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Purani chat nikalna
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Seen Status (Blue Tick)
router.put("/seen/:conversationId", async (req, res) => {
    try {
        await Message.updateMany(
            { conversationId: req.params.conversationId, seen: false },
            { $set: { seen: true } }
        );
        res.status(200).json("Messages marked as seen");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete Message for Everyone
router.delete("/:id", async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).json("Message deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;