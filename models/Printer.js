import mongoose from "mongoose";

const PrinterSchema = new mongoose.Schema({
    model: String,
    serial: String,
    ip: String,

    macAddress: {
        type: String,
        default: ""
    },

    printQueue: {
        type: String,
        default: ""
    },

    loc: String,
    col: String,

    costCenter: {
        type: String,
        default: ""
    },

    notes: String,
    backup: Boolean,
    photos: [String],

    plant: String,

    page: {
        type: Number,
        default: 1
    },

    x: Number,
    y: Number
});

export default mongoose.model("Printer", PrinterSchema);