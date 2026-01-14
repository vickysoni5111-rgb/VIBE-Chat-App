// const mongoose = require("mongoose");

// const MessageSchema = new mongoose.Schema({
//   conversationId: { type: String },
//   sender: { type: String },
//   text: { type: String },
//   fileUrl: { type: String }, // Images/Videos ke liye
//   messageType: { type: String, default: "text" }, // text, image, video
// }, { timestamps: true });

// module.exports = mongoose.model("Message", MessageSchema);




























const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversationId: { 
    type: String, 
    required: true 
  },
  sender: { 
    type: String, 
    required: true 
  },
  text: { 
    type: String 
  },
  // Images/Videos ke liye hum file ka naam ya URL save karenge
  fileName: { 
    type: String 
  }, 
  // messageType ki jagah fileType use kar rahe hain (Frontend sync ke liye)
  fileType: { 
    type: String, 
    default: "text", // options: "text", "image", "video"
  },
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);