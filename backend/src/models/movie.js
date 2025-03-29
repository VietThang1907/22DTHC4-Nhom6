// models/movie.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        releaseDate: { type: Date, required: true },
        genre: { type: String, required: true },
        language: { type: String, required: true },
        duration: { type: Number, required: true },
        rating: { type: Number, min: 0, max: 10 },
        imageUrl: { type: String },
        videoUrl: { type: String },
        category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },  // Khóa ngoại liên kết với Category
        slug: { type: String, required: true, unique: true },  // Trường slug
    },
    { timestamps: true }
);

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
