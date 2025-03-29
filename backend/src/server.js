const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db"); // Chỉ cần import connectDB từ MongoDB
const swaggerDocs = require("./config/swaggerConfig");
const movieRoutes = require("./routes/movieRoutes");
const movieCrawlRoutes = require('./routes/movieCrawlRoutes');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("uploads")); // Cho phép truy cập ảnh đã upload

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
app.use("/api", movieRoutes);
app.use('/api', movieCrawlRoutes);

// 🟢 Kết nối MongoDB
connectDB(); // Đảm bảo rằng hàm connectDB() từ db.js đã được gọi

// 🟢 Kích hoạt Swagger Docs
swaggerDocs(app);

// 🟢 Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});
