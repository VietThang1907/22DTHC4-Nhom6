const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
        method: { type: String, required: true }, // Example: "Credit Card", "PayPal"
        date: { type: Date, default: Date.now },
        status: { type: String, default: "Completed" }, // Example: "Completed", "Pending"
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
