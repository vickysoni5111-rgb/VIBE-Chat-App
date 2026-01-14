
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// const connectDB = require('./db');
// const mongoose = require('mongoose');
// const path = require("path");
// const multer = require("multer");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
// });

// connectDB();

// app.use(express.json());
// app.use(cors());
// app.use("/images", express.static(path.join(__dirname, "public/images")));

// // --- SCHEMAS ---
// const postSchema = new mongoose.Schema({
//     userId: String,
//     username: String,
//     img: String,
//     caption: String,
//     likes: { type: Array, default: [] },
//     comments: [{ username: String, text: String, createdAt: { type: Date, default: Date.now } }],
//     createdAt: { type: Date, default: Date.now }
// });
// const Post = mongoose.model("Post", postSchema);

// const notificationSchema = new mongoose.Schema({
//     receiverId: String,
//     senderName: String,
//     type: String, // "like" or "comment"
//     postImg: String,
//     isRead: { type: Boolean, default: false },
//     createdAt: { type: Date, default: Date.now }
// });
// const Notification = mongoose.model("Notification", notificationSchema);

// // --- SOCKET.IO LOGIC ---
// let onlineUsers = [];
// const addNewUser = (userId, socketId) => {
//     !onlineUsers.some((user) => user.userId === userId) && onlineUsers.push({ userId, socketId });
// };
// const getUser = (userId) => onlineUsers.find((user) => user.userId === userId);

// io.on("connection", (socket) => {
//     socket.on("newUser", (userId) => addNewUser(userId, socket.id));

//     socket.on("sendNotification", ({ receiverId, senderName, type, postImg }) => {
//         const receiver = getUser(receiverId);
//         if (receiver) {
//             io.to(receiver.socketId).emit("getNotification", { senderName, type, postImg });
//         }
//     });

//     socket.on("disconnect", () => {
//         onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
//     });
// });

// // --- ROUTES ---

// // Like Post + Save Notification
// app.put("/api/posts/:id/like", async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         const { userId, username } = req.body;
//         if (!post.likes.includes(userId)) {
//             await post.updateOne({ $push: { likes: userId } });
//             if (post.userId !== userId) {
//                 const newNotif = new Notification({
//                     receiverId: post.userId,
//                     senderName: username,
//                     type: "liked your post",
//                     postImg: post.img
//                 });
//                 await newNotif.save();
//             }
//             res.status(200).json("Liked");
//         } else {
//             await post.updateOne({ $pull: { likes: userId } });
//             res.status(200).json("Unliked");
//         }
//     } catch (err) { res.status(500).json(err); }
// });

// // Comment + Save Notification
// app.post("/api/posts/:id/comment", async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         const { userId, username, text } = req.body;
//         const newComment = { username, text };
//         await Post.findByIdAndUpdate(req.params.id, { $push: { comments: newComment } });
        
//         if (post.userId !== userId) {
//             const newNotif = new Notification({
//                 receiverId: post.userId,
//                 senderName: username,
//                 type: `commented: ${text}`,
//                 postImg: post.img
//             });
//             await newNotif.save();
//         }
//         res.status(200).json("Commented");
//     } catch (err) { res.status(500).json(err); }
// });

// // Get Notifications
// app.get("/api/notifications/:userId", async (req, res) => {
//     try {
//         const notifs = await Notification.find({ receiverId: req.params.userId }).sort({ createdAt: -1 });
//         res.status(200).json(notifs);
//     } catch (err) { res.status(500).json(err); }
// });

// // (Baaki Routes: /api/posts/create, /api/posts/all same rahenge)

// server.listen(5000, () => console.log("🚀 Server running on 5000"));



// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// const connectDB = require('./db');
// const mongoose = require('mongoose');
// const path = require("path");
// const multer = require("multer");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
// });

// // Connect Database
// connectDB();

// app.use(express.json());
// app.use(cors());
// app.use("/images", express.static(path.join(__dirname, "public/images")));

// // --- SCHEMAS ---

// const postSchema = new mongoose.Schema({
//     userId: String,
//     username: String,
//     img: String,
//     caption: String,
//     likes: { type: Array, default: [] },
//     comments: [{ username: String, text: String, createdAt: { type: Date, default: Date.now } }],
//     createdAt: { type: Date, default: Date.now }
// });
// const Post = mongoose.model("Post", postSchema);

// const notificationSchema = new mongoose.Schema({
//     receiverId: String,
//     senderName: String,
//     type: String, 
//     postImg: String,
//     isRead: { type: Boolean, default: false },
//     createdAt: { type: Date, default: Date.now }
// });
// const Notification = mongoose.model("Notification", notificationSchema);

// const messageSchema = new mongoose.Schema({
//     conversationId: String,
//     senderId: String,
//     receiverId: String,
//     text: String,
//     fileName: String,
//     fileType: String,
//     seen: { type: Boolean, default: false }, // ✅ Message Read status
//     createdAt: { type: Date, default: Date.now }
// });
// const Message = mongoose.model("Message", messageSchema);

// // --- SOCKET.IO LOGIC ---

// let onlineUsers = [];
// const addNewUser = (userId, socketId) => {
//     !onlineUsers.some((user) => user.userId === userId) && onlineUsers.push({ userId, socketId });
// };
// const getUser = (userId) => onlineUsers.find((user) => user.userId === userId);

// io.on("connection", (socket) => {
//     // Register User
//     socket.on("newUser", (userId) => addNewUser(userId, socket.id));
//     socket.on("addUser", (userId) => addNewUser(userId, socket.id));

//     // Handle Notifications (Likes/Comments)
//     socket.on("sendNotification", ({ receiverId, senderName, type, postImg }) => {
//         const receiver = getUser(receiverId);
//         if (receiver) {
//             io.to(receiver.socketId).emit("getNotification", { senderName, type, postImg });
//         }
//     });

//     // Handle Real-time Messages
//     socket.on("sendMessage", (data) => {
//         const receiver = getUser(data.receiverId);
//         if (receiver) {
//             io.to(receiver.socketId).emit("getMessage", data);
//         }
//     });

//     socket.on("disconnect", () => {
//         onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
//     });
// });

// // --- ROUTES ---

// // 1. Post Routes
// app.get("/api/posts/all", async (req, res) => {
//     try {
//         const posts = await Post.find().sort({ createdAt: -1 });
//         res.status(200).json(posts);
//     } catch (err) { res.status(500).json(err); }
// });

// app.put("/api/posts/:id/like", async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         const { userId, username } = req.body;
//         if (!post.likes.includes(userId)) {
//             await post.updateOne({ $push: { likes: userId } });
//             if (post.userId !== userId) {
//                 const newNotif = new Notification({
//                     receiverId: post.userId, senderName: username, type: "liked your post", postImg: post.img
//                 });
//                 await newNotif.save();
//             }
//             res.status(200).json("Liked");
//         } else {
//             await post.updateOne({ $pull: { likes: userId } });
//             res.status(200).json("Unliked");
//         }
//     } catch (err) { res.status(500).json(err); }
// });

// // 2. Message & Seen Logic Routes

// // ✅ Save Message
// app.post("/api/messages", async (req, res) => {
//     const newMessage = new Message(req.body);
//     try {
//         const savedMessage = await newMessage.save();
//         res.status(200).json(savedMessage);
//     } catch (err) { res.status(500).json(err); }
// });

// // ✅ Get Messages for a Conversation
// app.get("/api/messages/:convId", async (req, res) => {
//     try {
//         const messages = await Message.find({ conversationId: req.params.convId });
//         res.status(200).json(messages);
//     } catch (err) { res.status(500).json(err); }
// });

// // ✅ Update Seen Status (Mark as Read)
// app.put("/api/messages/seen/:convId/:userId", async (req, res) => {
//     try {
//         await Message.updateMany(
//             { conversationId: req.params.convId, receiverId: req.params.userId, seen: false },
//             { $set: { seen: true } }
//         );
//         res.status(200).json("Messages marked as seen");
//     } catch (err) { res.status(500).json(err); }
// });

// // ✅ Get Unseen Counts
// app.get("/api/messages/unseen-count/:userId", async (req, res) => {
//     try {
//         const total = await Message.countDocuments({ receiverId: req.params.userId, seen: false });
//         const messages = await Message.find({ receiverId: req.params.userId, seen: false });
//         res.status(200).json({ total, messages });
//     } catch (err) { res.status(500).json(err); }
// });

// // 3. Notification Routes
// app.get("/api/notifications/:userId", async (req, res) => {
//     try {
//         const notifs = await Notification.find({ receiverId: req.params.userId }).sort({ createdAt: -1 });
//         res.status(200).json(notifs);
//     } catch (err) { res.status(500).json(err); }
// });

// server.listen(5000, () => console.log("🚀 Server running on port 5000"));






// // ye mera functionality wala code hai 

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// const connectDB = require('./db');
// const authRoute = require('./routes/auth');
// const conversationRoute = require("./routes/conversations");
// const messageRoute = require("./routes/messages");
// const multer = require("multer");
// const path = require("path");
// const mongoose = require('mongoose');

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//     cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
// });

// // ✅ DB Connect call
// connectDB();

// app.use(express.json());
// app.use(cors());
// app.use("/images", express.static(path.join(__dirname, "public/images")));

// // MULTER CONFIG
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => { cb(null, "public/images"); },
//     filename: (req, file, cb) => { cb(null, Date.now() + "-" + file.originalname); },
// });
// const upload = multer({ storage: storage });

// app.post("/api/upload", upload.single("file"), (req, res) => {
//     try { return res.status(200).json(req.file.filename); }
//     catch (err) { console.error(err); }
// });

// // ✅ POST SCHEMA
// const postSchema = new mongoose.Schema({
//     user: String,
//     userId: String,
//     img: String,
//     caption: String,
//     likes: { type: Array, default: [] },
//     comments: [
//         {
//             username: String,
//             text: String,
//             createdAt: { type: Date, default: Date.now }
//         }
//     ],
//     createdAt: { type: Date, default: Date.now }
// });
// const Post = mongoose.model("Post", postSchema);

// // ROUTES
// app.post("/api/posts/create", async (req, res) => {
//     try {
//         const newPost = new Post(req.body);
//         await newPost.save();
//         res.status(200).json("Post Saved");
//     } catch (err) { res.status(500).json(err); }
// });

// app.get("/api/posts/all", async (req, res) => {
//     try {
//         const posts = await Post.find().sort({ createdAt: -1 });
//         res.status(200).json(posts);
//     } catch (err) { res.status(500).json(err); }
// });

// // ✅ LIKE/UNLIKE (Fixed Operation)
// app.put("/api/posts/:id/like", async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         if (!post.likes.includes(req.body.userId)) {
//             await post.updateOne({ $push: { likes: req.body.userId } });
//             res.status(200).json("Liked");
//         } else {
//             await post.updateOne({ $pull: { likes: req.body.userId } });
//             res.status(200).json("Disliked");
//         }
//     } catch (err) { res.status(500).json(err); }
// });

// // ✅ COMMENT (Fixed Operation)
// app.post("/api/posts/:id/comment", async (req, res) => {
//     try {
//         const newComment = { username: req.body.username, text: req.body.text };
//         await Post.findByIdAndUpdate(req.params.id, { $push: { comments: newComment } });
//         res.status(200).json("Commented");
//     } catch (err) { res.status(500).json(err); }
// });

// app.delete("/api/posts/:id", async (req, res) => {
//     try {
//         await Post.findByIdAndDelete(req.params.id);
//         res.status(200).json("Deleted");
//     } catch (err) { res.status(500).json(err); }
// });

// app.use("/api/auth", authRoute);
// app.use("/api/conversations", conversationRoute);
// app.use("/api/messages", messageRoute);

// // SOCKET LOGIC
// let users = [];
// io.on("connection", (socket) => {
//     socket.on("addUser", (userId) => {
//         if (userId && !users.some((u) => u.userId === userId)) {
//             users.push({ userId, socketId: socket.id });
//         }
//         io.emit("getUsers", users);
//     });
//     socket.on("sendMessage", (data) => {
//         const user = users.find((u) => u.userId === data.receiverId);
//         if (user) io.to(user.socketId).emit("getMessage", data);
//     });
//     socket.on("disconnect", () => {
//         users = users.filter((u) => u.socketId !== socket.id);
//         io.emit("getUsers", users);
//     });
// });

// server.listen(5000, () => console.log("🚀 Server Running on Port 5000"));



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./db');
const authRoute = require('./routes/auth');
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const multer = require("multer");
const path = require("path");
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

connectDB();

app.use(express.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "public/images")));

// MULTER CONFIG
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, "public/images"); },
    filename: (req, file, cb) => { cb(null, Date.now() + "-" + file.originalname); },
});
const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
    try { return res.status(200).json(req.file.filename); }
    catch (err) { console.error(err); }
});

// POST SCHEMA
const postSchema = new mongoose.Schema({
    user: String,
    userId: String,
    img: String,
    caption: String,
    likes: { type: Array, default: [] },
    comments: [
        {
            username: String,
            text: String,
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.model("Post", postSchema);

// POST ROUTES
app.post("/api/posts/create", async (req, res) => {
    try {
        const newPost = new Post(req.body);
        await newPost.save();
        res.status(200).json("Post Saved");
    } catch (err) { res.status(500).json(err); }
});

app.get("/api/posts/all", async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) { res.status(500).json(err); }
});

app.put("/api/posts/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("Liked");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("Disliked");
        }
    } catch (err) { res.status(500).json(err); }
});

app.post("/api/posts/:id/comment", async (req, res) => {
    try {
        const newComment = { username: req.body.username, text: req.body.text };
        await Post.findByIdAndUpdate(req.params.id, { $push: { comments: newComment } });
        res.status(200).json("Commented");
    } catch (err) { res.status(500).json(err); }
});

app.delete("/api/posts/:id", async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted");
    } catch (err) { res.status(500).json(err); }
});

app.use("/api/auth", authRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

// SOCKET LOGIC (Updated for Real-time Delete)
let users = [];
io.on("connection", (socket) => {
    socket.on("addUser", (userId) => {
        if (userId && !users.some((u) => u.userId === userId)) {
            users.push({ userId, socketId: socket.id });
        }
        io.emit("getUsers", users);
    });

    socket.on("sendMessage", (data) => {
        const user = users.find((u) => u.userId === data.receiverId);
        if (user) io.to(user.socketId).emit("getMessage", data);
    });

    // Real-time Delete Event
    socket.on("deleteMessage", (data) => {
        const user = users.find((u) => u.userId === data.receiverId);
        if (user) io.to(user.socketId).emit("messageDeleted", { messageId: data.messageId });
    });

    socket.on("disconnect", () => {
        users = users.filter((u) => u.socketId !== socket.id);
        io.emit("getUsers", users);
    });
});

server.listen(5000, () => console.log("🚀 Server Running on Port 5000"));