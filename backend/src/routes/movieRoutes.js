// routes/movieRoutes.js
const express = require("express");
const router = express.Router();
const MovieController = require("../controllers/movieController");

/**
 * @swagger
 * tags:
 *   name: Movie
 *   description: Quản lý phim
 */

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Thêm mới phim
 *     tags: [Movie]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Avengers: Endgame"
 *               description:
 *                 type: string
 *                 example: "The Avengers assemble once again to defeat Thanos."
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: "2019-04-26"
 *               genre:
 *                 type: string
 *                 example: "Action"
 *               language:
 *                 type: string
 *                 example: "English"
 *               duration:
 *                 type: integer
 *                 example: 181
 *               rating:
 *                 type: number
 *                 example: 8.4
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/avengers-endgame.jpg"
 *               videoUrl:
 *                 type: string
 *                 example: "https://example.com/avengers-endgame.mp4"
 *     responses:
 *       201:
 *         description: Phim đã được thêm thành công
 *       400:
 *         description: Lỗi dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi hệ thống
 */
router.post("/movies", MovieController.create);       // Thêm mới phim

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Lấy danh sách tất cả phim
 *     tags: [Movie]
 *     responses:
 *       200:
 *         description: Danh sách tất cả các phim
 *       500:
 *         description: Lỗi hệ thống
 */
router.get("/movies", MovieController.getAll);        // Lấy tất cả phim

/**
 * @swagger
 * /api/movies/{movieId}:
 *   get:
 *     summary: Lấy thông tin phim theo ID
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         description: ID của phim cần lấy thông tin
 *         schema:
 *           type: string
 *           example: "60c72b2f5f1b2b001f9a2b3c"
 *     responses:
 *       200:
 *         description: Thông tin phim
 *       404:
 *         description: Phim không tồn tại
 *       500:
 *         description: Lỗi hệ thống
 */
router.get("/movies/:movieId", MovieController.getById);  // Lấy phim theo ID

/**
 * @swagger
 * /api/movies/{movieId}:
 *   put:
 *     summary: Cập nhật thông tin phim
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         description: ID của phim cần cập nhật
 *         schema:
 *           type: string
 *           example: "60c72b2f5f1b2b001f9a2b3c"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Avengers: Endgame"
 *               description:
 *                 type: string
 *                 example: "The Avengers assemble once again to defeat Thanos."
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: "2019-04-26"
 *               genre:
 *                 type: string
 *                 example: "Action"
 *               language:
 *                 type: string
 *                 example: "English"
 *               duration:
 *                 type: integer
 *                 example: 181
 *               rating:
 *                 type: number
 *                 example: 8.4
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/avengers-endgame.jpg"
 *               videoUrl:
 *                 type: string
 *                 example: "https://example.com/avengers-endgame.mp4"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin phim thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       404:
 *         description: Phim không tồn tại
 *       500:
 *         description: Lỗi hệ thống
 */
router.put("/movies/:movieId", MovieController.update);   // Cập nhật phim

/**
 * @swagger
 * /api/movies/{movieId}:
 *   delete:
 *     summary: Xóa phim theo ID
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         description: ID của phim cần xóa
 *         schema:
 *           type: string
 *           example: "60c72b2f5f1b2b001f9a2b3c"
 *     responses:
 *       200:
 *         description: Phim đã được xóa thành công
 *       404:
 *         description: Phim không tồn tại
 *       500:
 *         description: Lỗi hệ thống
 */
router.delete("/movies/:movieId", MovieController.delete);  // Xóa phim

/**
 * @swagger
 * /api/ophim/movies:
 *   get:
 *     summary: Lấy danh sách phim mới từ OPhim
 *     tags: [Movie]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Số trang để lấy phim (default là 1)
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Danh sách phim từ OPhim
 *       500:
 *         description: Lỗi khi lấy dữ liệu từ OPhim
 */
router.get('/ophim/movies', MovieController.getOphimMovies);  // Lấy danh sách phim từ OPhim

/**
 * @swagger
 * /api/ophim/movies/{slug}:
 *   get:
 *     summary: Lấy thông tin chi tiết phim từ OPhim theo slug
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: Slug của phim cần lấy thông tin chi tiết
 *         schema:
 *           type: string
 *           example: "avengers-endgame"
 *     responses:
 *       200:
 *         description: Thông tin chi tiết phim từ OPhim
 *       500:
 *         description: Lỗi khi lấy thông tin từ OPhim
 */
router.get('/ophim/movies/:slug', MovieController.getOphimMovieDetails);  // Lấy thông tin chi tiết phim từ OPhim

/**
 * @swagger
 * /api/movies/ophim/all:
 *   get:
 *     summary: Lấy tất cả phim từ OPhim
 *     tags: [Movie]
 *     responses:
 *       200:
 *         description: Danh sách tất cả phim từ OPhim
 *       500:
 *         description: Lỗi khi lấy dữ liệu từ OPhim
 */
router.get('/movies/ophim/all', MovieController.getAllOphimMovies);

module.exports = router;
