const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historySchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        movieId: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
        watchedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const History = mongoose.model("History", historySchema);

module.exports = History;
