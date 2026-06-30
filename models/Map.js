import mongoose from "mongoose";

const mapSchema = new mongoose.Schema({

    contractNumber: {
        type: String,
        required: true,
        default: "1234",
        trim: true
    },

    name: {
        type: String,
        required: true,
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

mapSchema.index(
    {
        contractNumber: 1,
        name: 1
    },
    {
        unique: true
    }
);

export default mongoose.model(
    "Map",
    mapSchema
);