import mongoose from "mongoose";

const userAccessSchema = new mongoose.Schema(
    {
        contractNumber: {
            type: String,
            required: true,
            trim: true
        },

        role: {
            type: String,
            enum: ["user", "admin", "gestor"],
            default: "user"
        },

        plants: {
            type: [String],
            default: ["SJP"]
        }
    },
    {
        _id: false
    }
);

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

    // Campo antigo: vamos manter por compatibilidade
    role: {
        type: String,
        enum: ["admin", "user", "gestor"],
        default: "user"
    },

    // Campo antigo: vamos manter por compatibilidade
    plant: {
        type: String,
        enum: ["", "ANC", "SCAR", "SJP", "TAUB", "VIN", "ALL"],
        default: ""
    },

    requestedContractNumber: {
        type: String,
        default: "",
        trim: true
    },

    // Campo novo para multi-contrato
    access: {
        type: [userAccessSchema],
        default: []
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