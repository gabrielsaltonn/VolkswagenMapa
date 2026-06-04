import mongoose from "mongoose";

const PrinterSchema = new mongoose.Schema({
    model: String,
    serial: String,
    ip: String,
    loc: String,
    col: String,
    notes: String,
    backup: Boolean,
    photos: [String],
    plant: String,
    x: Number,
    y: Number
});

export default mongoose.model("Printer", PrinterSchema);