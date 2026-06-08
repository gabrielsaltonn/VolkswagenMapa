import mongoose from "mongoose";

const quickLinkSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    url: {
        type: String,
        required: true
    },

    pinned: {
        type: Boolean,
        default: false
    },

    user: {
        type: String,
        required: true
    }

});

export default mongoose.model(
    "QuickLink",
    quickLinkSchema
);