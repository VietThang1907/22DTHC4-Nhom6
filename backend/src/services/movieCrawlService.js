// services/movieCrawlService.js
require('dotenv').config();
const axios = require('axios');
const Movie = require('../models/movie');
const Category = require('../models/category');

// Cấu hình URL cơ bản từ biến môi trường hoặc giá trị mặc định
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api/ophim/';

class MovieCrawlService {
    async crawlMovies(page = 1) { // Accept page as a parameter, default is 1
        try {
            // Lấy danh sách phim từ API, với page truyền vào
            const response = await axios.get(`${BASE_URL}movies`, {
                params: { page }  // Include the page parameter
            });
            const data = response.data;

            console.log("Dữ liệu nhận được từ API:", JSON.stringify(data, null, 2)); // Log the entire response

            // Kiểm tra dữ liệu trả về có hợp lệ không
            if (data.data && data.data.status && Array.isArray(data.data.items) && data.data.items.length > 0) {
                const moviesList = data.data.items;

                // Lấy thông tin chi tiết của từng phim
                const movieDetailsPromises = moviesList.map(movie => {
                    if (!movie.slug) {
                        console.error(`❌ Phim '${movie.name}' thiếu slug, không thể lấy chi tiết.`);
                        return null;
                    }

                    return axios.get(`${BASE_URL}movies/${movie.slug}`)
                        .then(res => {
                            console.log(`Dữ liệu chi tiết phim ${movie.slug}:`, res.data.data.movie);
                            return res.data.data.movie; // Correctly access the 'movie' field
                        })
                        .catch(err => {
                            console.error(`Lỗi khi lấy chi tiết phim ${movie.slug}:`, err.message);
                            return null;
                        });
                });

                // Wait for all movie details to be fetched
                const movieDetails = await Promise.all(movieDetailsPromises);

                console.log("Movies details:", movieDetails);

                const validMovies = movieDetails.filter(movie => movie !== null);

                if (validMovies.length === 0) {
                    console.log("❌ Không có dữ liệu phim chi tiết nào được lấy về.");
                    return;
                }
                const savedMovies = [];
                // Lưu từng phim vào cơ sở dữ liệu
                for (const movieDetail of validMovies) {
                    if (!movieDetail) {
                        console.log("❌ Phim không có dữ liệu chi tiết.");
                        continue;
                    }

                    const genre = movieDetail.genre || 'Unknown';

                    let category = await Category.findOne({ name: genre });
                    if (!category) {
                        category = new Category({ name: genre });
                        await category.save();
                        console.log(`✅ Thể loại '${genre}' đã được tạo!`);
                    }
                    const slug = movieDetail.slug;
                    const movieUrl = `${BASE_URL}movies/${slug}`;

                    const movieData = {
                        title: movieDetail.name,
                        description: movieDetail.origin_name || movieDetail.name,
                        releaseDate: new Date(movieDetail.year, 0, 1),
                        genre: genre,
                        language: movieDetail.language || 'Vietnamese',
                        duration: movieDetail.duration || 120,
                        rating: movieDetail.tmdb?.vote_average || 0,
                        imageUrl: movieDetail.poster_url || movieDetail.thumb_url,
                        videoUrl: movieDetail.videoUrl || null,
                        category_id: category._id,
                        slug: slug,
                        link: movieUrl,
                    };

                    const movie = new Movie(movieData);
                    await movie.save();

                    console.log(`✅ Phim '${movieDetail.name}' đã được lưu vào cơ sở dữ liệu!`);
                    savedMovies.push(movie); // Push the saved movie to the array
                }
                return savedMovies;

                console.log('🎉 Crawl dữ liệu phim từ OPhim thành công!');
            } else {
                console.log('❌ Không có dữ liệu phim từ OPhim hoặc cấu trúc dữ liệu không hợp lệ.');
            }
        } catch (error) {
            console.error('❌ Lỗi khi crawl dữ liệu phim từ OPhim:', error.message);
        }
    }
    async crawlMoviesAllPage() {
        try {
            const totalPages = 1206; // Tổng số trang (cập nhật theo yêu cầu của bạn)
            const allMovies = [];
            const errors = []; // To store errors
            // Lặp qua tất cả các trang (từ 1 đến 1206)
            for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
                const response = await axios.get(`${BASE_URL}movies`, {
                    params: { page: currentPage }
                });
                const data = response.data;

                console.log(`Crawl trang ${currentPage}...`);

                if (data.data && data.data.status && Array.isArray(data.data.items) && data.data.items.length > 0) {
                    const moviesList = data.data.items;

                    // Lấy thông tin chi tiết của từng phim
                    const movieDetailsPromises = moviesList.map(movie => {
                        if (!movie.slug) {
                            console.error(`❌ Phim '${movie.name}' thiếu slug, không thể lấy chi tiết.`);
                            return null;
                        }

                        return axios.get(`${BASE_URL}movies/${movie.slug}`)
                            .then(res => res.data.data.movie)
                            .catch(err => {
                                console.error(`Lỗi khi lấy chi tiết phim ${movie.slug}:`, err.message);
                                return null;
                            });
                    });

                    const movieDetails = await Promise.all(movieDetailsPromises);
                    const validMovies = movieDetails.filter(movie => movie !== null);

                    if (validMovies.length === 0) {
                        console.log(`❌ Không có dữ liệu phim chi tiết nào được lấy về từ trang ${currentPage}.`);
                        continue;
                    }

                    // Lưu từng phim vào cơ sở dữ liệu
                    const savedMovies = [];
                    for (const movieDetail of validMovies) {
                        if (!movieDetail) {
                            console.log("❌ Phim không có dữ liệu chi tiết.");
                            continue;
                        }

                        const genre = movieDetail.genre || 'Unknown';

                        let category = await Category.findOne({ name: genre });
                        if (!category) {
                            category = new Category({ name: genre });
                            await category.save();
                            console.log(`✅ Thể loại '${genre}' đã được tạo!`);
                        }

                        const movieData = {
                            title: movieDetail.name,
                            description: movieDetail.origin_name || movieDetail.name,
                            releaseDate: new Date(movieDetail.year, 0, 1),
                            genre: genre,
                            language: movieDetail.language || 'Vietnamese',
                            duration: movieDetail.duration || 120,
                            rating: movieDetail.tmdb?.vote_average || 0,
                            imageUrl: movieDetail.poster_url || movieDetail.thumb_url,
                            videoUrl: movieDetail.videoUrl || null,
                            category_id: category._id,
                            slug: movieDetail.slug,
                            link: `${BASE_URL}movies/${movieDetail.slug}`,
                        };

                        try {
                            const movie = new Movie(movieData);
                            await movie.save();
                            console.log(`✅ Phim '${movieDetail.name}' đã được lưu vào cơ sở dữ liệu!`);
                            savedMovies.push(movie);  // Add the saved movie to the array
                        } catch (err) {
                            // Specific error handling for duplicate key errors (E11000)
                            if (err.code === 11000) {
                                console.error(`❌ Lỗi trùng lặp slug: '${movieDetail.slug}', bỏ qua phim này.`);
                                errors.push({ movie: movieDetail.name, slug: movieDetail.slug }); // Save error for reporting
                            } else {
                                console.error(`❌ Lỗi khi lưu phim '${movieDetail.name}':`, err.message);
                                errors.push({ movie: movieDetail.name, error: err.message });
                            }
                        }
                    }
                    allMovies.push(...savedMovies);  // Kết hợp tất cả phim đã crawl
                } else {
                    console.log(`❌ Không có phim nào trên trang ${currentPage}`);
                }
            }

            console.log(`🎉 Crawl dữ liệu phim từ OPhim hoàn thành!`);
            return allMovies; // Trả về danh sách tất cả các phim đã được crawl
        } catch (error) {
            console.error('❌ Lỗi khi crawl dữ liệu phim từ OPhim:', error.message);
            throw error;
        }
    }
}

module.exports = new MovieCrawlService();
