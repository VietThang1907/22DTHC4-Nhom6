// services/movieService.js
const Movie = require("../models/movie");

class MovieService {
    // Thêm mới phim
    async createMovie(movieData) {
        try {
            const movie = new Movie(movieData);
            return await movie.save();
        } catch (error) {
            throw new Error("Không thể thêm phim mới: " + error.message);
        }
    }

    // Lấy tất cả phim kèm thông tin category
    async getAllMovies() {
        try {
            return await Movie.find().populate('category_id').lean(); // Populate và lean cho hiệu suất tốt hơn
        } catch (error) {
            throw new Error("Không thể lấy danh sách phim: " + error.message);
        }
    }

    // Lấy phim theo ID kèm thông tin category
    async getMovieById(movieId) {
        try {
            return await Movie.findById(movieId).populate('category_id').lean(); // Populate và lean
        } catch (error) {
            throw new Error("Không thể lấy thông tin phim: " + error.message);
        }
    }

    // Cập nhật thông tin phim
    async updateMovie(movieId, updateData) {
        try {
            return await Movie.findByIdAndUpdate(movieId, updateData, { new: true });
        } catch (error) {
            throw new Error("Không thể cập nhật phim: " + error.message);
        }
    }

    // Xóa phim
    async deleteMovie(movieId) {
        try {
            return await Movie.findByIdAndDelete(movieId);
        } catch (error) {
            throw new Error("Không thể xóa phim: " + error.message);
        }
    }
}

module.exports = new MovieService();
