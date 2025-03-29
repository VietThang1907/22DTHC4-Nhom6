const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AccountType = require("./accountType"); // Import mô hình AccountType

// Mô hình User
const userSchema = new Schema(
    {
        fullname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        address: { type: String, default: null },
        phone: { type: String, default: null },
        date_of_birth: { type: Date, default: null },
        role_id: { type: Schema.Types.ObjectId, ref: "Role", required: true }, // Liên kết tới Role
        accountTypeId: {
            type: Schema.Types.ObjectId,
            ref: "AccountType",
            required: true
        }, // Liên kết tới AccountType
    },
    { timestamps: true }
);

// Export mô hình User
const User = mongoose.model("User", userSchema);

module.exports = User;
