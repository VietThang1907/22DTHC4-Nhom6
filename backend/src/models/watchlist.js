const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const watchlistSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        movieIds: [{ type: Schema.Types.ObjectId, ref: "Movie", required: true }],
    },
    { timestamps: true }
);

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

module.exports = Watchlist;
