
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- REGISTER ---
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, phoneNumber } = req.body;

        // 1. Validation: Check if all fields exist
        if (!username || !email || !password || !phoneNumber) {
            return res.status(400).json({ message: "Please fill all fields!" });
        }

        // 2. Check for Duplicate User (Username or Email)
        const userExists = await User.findOne({ 
            $or: [{ email: email }, { username: username }] 
        });
        
        if (userExists) {
            return res.status(400).json({ message: "Username or Email already exists!" });
        }

        // 3. Password Hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Save User to MongoDB
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phoneNumber
        });

        const savedUser = await newUser.save();
        console.log("✅ User Registered:", savedUser.username);
        
        res.status(200).json({ message: "Registration Successful!", user: savedUser });

    } catch (err) {
        console.error("🔥 Error:", err.message);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find User
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found!" });

        // Compare Password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Wrong password!" });

        // Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "5d" });
        
        const { password: pw, ...others } = user._doc;
        res.status(200).json({ ...others, token });

    } catch (err) {
        res.status(500).json({ message: "Login Error" });
    }
});

// --- NEW: GET USER DETAILS BY ID (Sidebar mein Naam dikhane ke liye) ---
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found!" });

        // Password ko security ke liye hata rahe hain
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        console.error("🔥 Error fetching user:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;

































// const router = require("express").Router();
// const User = require("../models/User");

// // Interaction Route
// router.put("/interact", async (req, res) => {
//   const { ownerId, postId, img, caption, ownerName, type, commentText, actionByName } = req.body;
//   try {
//     // Post ke asli malik (Priyanka/Raju) ka account dhundna
//     const owner = await User.findById(ownerId);
//     if (!owner) return res.status(404).json("User not found");

//     if (type === "like") {
//       owner.likedPosts.push({ postId, img, caption, ownerName, likedBy: actionByName });
//     } else if (type === "comment") {
//       owner.comments.push({ postId, text: commentText, img, ownerName, commentedBy: actionByName });
//     }

//     await owner.save();
//     res.status(200).json("Interaction Saved");
//   } catch (err) { res.status(500).json(err); }
// });

// // User Details fetch karne ke liye (Profile page)
// router.get("/user/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     res.status(200).json(user);
//   } catch (err) { res.status(500).json(err); }
// });

// module.exports = router;