import mongoose from "mongoose";

const contractSchema =
    new mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
                trim: true
            },

            number: {
                type: String,
                required: true,
                unique: true,
                trim: true
            },

            status: {
                type: String,
                enum: ["active", "inactive"],
                default: "active"
            },

            createdBy: {
                type: String,
                default: "",
                trim: true,
                lowercase: true
            },

            managers: {
                type: [String],
                default: []
            }
        },
        {
            timestamps: true
        }
    );

contractSchema.pre("save", function () {

    this.managers =
        [
            ...new Set(
                (this.managers || [])
                    .map(manager =>
                        String(manager || "")
                            .trim()
                            .toLowerCase()
                    )
                    .filter(Boolean)
            )
        ];

    this.createdBy =
        String(this.createdBy || "")
            .trim()
            .toLowerCase();

});

export default mongoose.model(
    "Contract",
    contractSchema
);