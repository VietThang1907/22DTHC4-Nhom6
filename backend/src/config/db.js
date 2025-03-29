const mongoose = require("mongoose");
require("dotenv").config();

// Kết nối MongoDB
const connectDB = async () => {
    try {
        const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/netflix-clone";
        await mongoose.connect(dbURI); // Loại bỏ useNewUrlParser và useUnifiedTopology
        console.log("✅ Kết nối MongoDB thành công!");
    } catch (error) {
        console.error("❌ Lỗi kết nối MongoDB:", error);
        process.exit(1);
    }
};

module.exports = { connectDB };
