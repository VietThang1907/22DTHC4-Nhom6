const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Role = require("../models/role");
const AccountType = require("../models/accountType");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Quản lý xác thực người dùng
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               email:
 *                 type: string
 *                 example: "example@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               retype_password:
 *                 type: string
 *                 example: "123456"
 *               address:
 *                 type: string
 *                 example: "Hà Nội, Việt Nam"
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: "2000-01-01"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Lỗi dữ liệu đầu vào (Mật khẩu không khớp, email đã tồn tại, v.v.)
 *       500:
 *         description: Lỗi hệ thống
 */
router.post("/register", async (req, res) => {
    const { fullname, email, password, retype_password, address, phone, date_of_birth } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Email không hợp lệ" });
    }

    if (password !== retype_password) {
        return res.status(400).json({ error: "Mật khẩu không khớp!" });
    }

    try {
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email đã tồn tại" });
        }

        // Lấy ObjectId của Role (User) và AccountType (Normal hoặc VIP)
        const role = await Role.findOne({ name: "User" });
        const accountType = await AccountType.findOne({ name: "Normal" });  // Hoặc "VIP"

        if (!role || !accountType) {
            return res.status(400).json({ error: "Không tìm thấy vai trò hoặc loại tài khoản" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới với ObjectId của Role và AccountType
        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            address,
            phone,
            date_of_birth,
            role_id: role._id,
            accountTypeId: accountType._id,  // Liên kết với loại tài khoản
        });

        // Tạo token JWT
        const token = jwt.sign({ userId: newUser._id, email: newUser.email, role: newUser.role_id }, process.env.JWT_SECRET, { expiresIn: "2h" });

        res.status(201).json({ message: "Đăng ký thành công", token });
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
});


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "example@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về token JWT
 *       400:
 *         description: Sai email hoặc mật khẩu
 *       500:
 *         description: Lỗi hệ thống
 */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Email không hợp lệ" });
    }
    try {


        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findOne({ email }).populate("role_id").populate("accountTypeId");
        if (!user) {
            return res.status(400).json({ error: "Email không tồn tại" });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Mật khẩu không đúng" });
        }

        // Tạo token JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role_id.name, accountType: user.accountTypeId.name },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.status(200).json({ message: "Đăng nhập thành công", token });
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
});

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Thay đổi mật khẩu người dùng
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "605c72ef153207001f85eaf"
 *               oldPassword:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Thay đổi mật khẩu thành công
 *       400:
 *         description: Mật khẩu cũ không đúng hoặc dữ liệu đầu vào không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi hệ thống
 */
router.post("/change-password", async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    // Kiểm tra mật khẩu mới hợp lệ (ví dụ: độ dài)
    if (newPassword.length < 6) {
        return res.status(400).json({ error: "Mật khẩu mới phải có ít nhất 6 ký tự" });
    }

    try {
        // Tìm người dùng theo userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Mật khẩu cũ không đúng" });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Lưu thông tin người dùng đã thay đổi mật khẩu
        await user.save();

        res.status(200).json({ message: "Thay đổi mật khẩu thành công" });
    } catch (error) {
        console.error("Lỗi thay đổi mật khẩu:", error);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
});


/**
 * @swagger
 * /api/auth/update:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "605c72ef153207001f85eaf"
 *               fullname:
 *                 type: string
 *                 example: "Nguyễn Văn B"
 *               email:
 *                 type: string
 *                 example: "newemail@example.com"
 *               address:
 *                 type: string
 *                 example: "Hà Nội, Việt Nam"
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: "1995-01-01"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi hệ thống
 */
router.put("/update", async (req, res) => {
    const { userId, fullname, email, address, phone, date_of_birth } = req.body;

    try {
        // Tìm người dùng theo userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
        }

        // Cập nhật thông tin người dùng
        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.address = address || user.address;
        user.phone = phone || user.phone;
        user.date_of_birth = date_of_birth || user.date_of_birth;

        // Lưu thông tin người dùng đã cập nhật
        await user.save();

        res.status(200).json({ message: "Cập nhật thông tin thành công", user });
    } catch (error) {
        console.error("Lỗi cập nhật thông tin người dùng:", error);
        res.status(500).json({ error: "Lỗi hệ thống" });
    }
});



module.exports = router;
