const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        // Lấy token từ header Authorization
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Truy cập bị từ chối. Token không hợp lệ!" });
        }

        // Loại bỏ "Bearer " để lấy token thực
        const token = authHeader.split(" ")[1];

        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Lưu thông tin user vào request
        req.user = decoded;

        console.log("Decoded User:", req.user);

        next();
    } catch (error) {
        console.error("JWT Error:", error);
        return res.status(403).json({ error: "Token không hợp lệ!" });
    }
};

module.exports = verifyToken;
