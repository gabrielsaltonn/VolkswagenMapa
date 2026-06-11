import mongoose from "mongoose";

const mapSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },

    label: {
        type: String,
        required: true,
        trim: true
    },

    pages: {
        type: [String],
        default: []
    }

});

export default mongoose.model(
    "Map",
    mapSchema
);