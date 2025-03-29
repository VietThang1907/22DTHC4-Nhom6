const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoritesListSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Người dùng
        movieIds: [{ type: Schema.Types.ObjectId, ref: "Movie" }] // Mảng các bộ phim yêu thích
    },
    { timestamps: true }
);

const FavoritesList = mongoose.model("FavoritesList", favoritesListSchema);

module.exports = FavoritesList;
