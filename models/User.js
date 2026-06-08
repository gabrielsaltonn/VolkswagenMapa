import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },

    plant: {
        type: String,
        enum: ["ANC", "SCAR", "SJP", "TAUB", "VIN", "ALL"],
        default: "SJP"
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }

});

export default mongoose.model(
    "User",
    userSchema
);