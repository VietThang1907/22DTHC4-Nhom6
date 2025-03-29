// controllers/movieController.js
const MovieService = require("../services/movieService");
const { successResponse, serverErrorResponse, notFoundResponse } = require("../utils/responseHelper");
const ophimService = require('../services/ophimService');
class MovieController {
    // Thêm mới phim
    async create(req, res) {
        const { title, description, releaseDate, genre, language, duration, rating, imageUrl, videoUrl } = req.body;

        const movieData = {
            title,
            description,
            releaseDate,
            genre,
            language,
            duration,
            rating,
            imageUrl,
            videoUrl,
        };

        try {
            const movie = await MovieService.createMovie(movieData);
            successResponse(res, "Phim đã được thêm thành công", movie, 201);
        } catch (error) {
            serverErrorResponse(res, error.message);
        }
    }

    // Lấy tất cả phim
    async getAll(req, res) {
        try {
            const movies = await MovieService.getAllMovies();
            successResponse(res, "Danh sách phim", movies);
        } catch (error) {
            serverErrorResponse(res, error.message);
        }
    }

    // Lấy phim theo ID
    async getById(req, res) {
        const { movieId } = req.params;

        try {
            const movie = await MovieService.getMovieById(movieId);
            if (!movie) {
                return notFoundResponse(res, "Phim không tồn tại");
            }
            successResponse(res, "Thông tin phim", movie);
        } catch (error) {
            serverErrorResponse(res, error.message);
        }
    }

    // Cập nhật phim
    async update(req, res) {
        const { movieId } = req.params;
        const updateData = req.body;

        try {
            const updatedMovie = await MovieService.updateMovie(movieId, updateData);
            if (!updatedMovie) {
                return notFoundResponse(res, "Phim không tồn tại");
            }
            successResponse(res, "Cập nhật phim thành công", updatedMovie);
        } catch (error) {
            serverErrorResponse(res, error.message);
        }
    }

    // Xóa phim
    async delete(req, res) {
        const { movieId } = req.params;

        try {
            const deletedMovie = await MovieService.deleteMovie(movieId);
            if (!deletedMovie) {
                return notFoundResponse(res, "Phim không tồn tại");
            }
            successResponse(res, "Xóa phim thành công");
        } catch (error) {
            serverErrorResponse(res, error.message);
        }
    }

    // Lấy danh sách phim từ OPhim API
    // Lấy danh sách phim từ OPhim API với page từ query
    async getOphimMovies(req, res) {
        const page = req.query.page || 1; // Default to page 1 if not provided
        try {
            const ophimMovies = await ophimService.getNewestMovies(page);
            successResponse(res, "Danh sách phim từ OPhim", ophimMovies);
        } catch (error) {
            serverErrorResponse(res, "Không thể lấy phim từ OPhim API", error.message);
        }
    }
    // async getOphimMovies(req, res) {
    //     try {
    //         // Giả sử bạn muốn lấy danh sách phim mới từ OPhim API
    //         const page = req.query.page || 1;
    //         const ophimMovies = await ophimService.getNewestMovies(page);

    //         successResponse(res, "Danh sách phim từ OPhim", ophimMovies);
    //     } catch (error) {
    //         serverErrorResponse(res, "Không thể lấy phim từ OPhim API", error.message);
    //     }
    // }
    // Lấy tất cả phim từ OPhim API
    async getAllOphimMovies(req, res) {
        try {
            const ophimMovies = await ophimService.getAllNewestMovies();
            successResponse(res, "Danh sách tất cả phim từ OPhim", ophimMovies);
        } catch (error) {
            serverErrorResponse(res, "Không thể lấy tất cả phim từ OPhim API", error.message);
        }
    }

    // Lấy thông tin chi tiết phim từ OPhim API
    async getOphimMovieDetails(req, res) {
        const { slug } = req.params;

        try {
            const movieDetails = await ophimService.getMovieDetails(slug);
            successResponse(res, "Thông tin chi tiết phim từ OPhim", movieDetails);
        } catch (error) {
            serverErrorResponse(res, "Không thể lấy thông tin phim từ OPhim API", error.message);
        }
    }
}

module.exports = new MovieController();
