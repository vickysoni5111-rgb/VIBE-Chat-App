// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//         // Aapki .env file se MONGO_URL uthayega
//         const conn = await mongoose.connect(process.env.MONGO_URL);
//         console.log(`✅ MongoDB Local Connected: ${conn.connection.host}`);
//     } catch (error) {
//         console.error(`❌ Error: ${error.message}`);
//         console.log("Tip: Check karein ki aapka MongoDB Compass ya Service chalu hai.");
//         process.exit(1); 
//     }
// };

// module.exports = connectDB;



// const mongoose = require('mongoose');
// require('dotenv').config(); // ✅ Yeh line yahan honi zaroori hai

// const connectDB = async () => {
//     try {
//         // Agar .env nahi chal raha toh default URL use karega
//         const url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ChatAppDB";
//         const conn = await mongoose.connect(url);
//         console.log(`✅ MongoDB Local Connected: ${conn.connection.host}`);
//     } catch (error) {
//         console.error(`❌ Error: ${error.message}`);
//         process.exit(1); 
//     }
// };

// module.exports = connectDB;









const mongoose = require('mongoose');
require('dotenv').config(); // ✅ Yeh line yahan honi zaroori hai

const connectDB = async () => {
    try {
        // Agar .env nahi chal raha toh default URL use karega
        const url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ChatAppDB";
        const conn = await mongoose.connect(url);
        console.log(`✅ MongoDB Local Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1); 
    }
};

module.exports = connectDB;