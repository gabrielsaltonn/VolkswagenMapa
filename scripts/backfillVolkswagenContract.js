import mongoose from "mongoose";
import dotenv from "dotenv";

import Contract from "../models/Contract.js";
import Map from "../models/Map.js";
import Printer from "../models/Printer.js";

dotenv.config();

const DEFAULT_CONTRACT = {
    name: "Volkswagen",
    number: "1234"
};

async function run() {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("Conectado ao MongoDB");

        await Contract.updateOne(
            {
                number: DEFAULT_CONTRACT.number
            },
            {
                $setOnInsert: {
                    name: DEFAULT_CONTRACT.name,
                    number: DEFAULT_CONTRACT.number,
                    status: "active"
                }
            },
            {
                upsert: true
            }
        );

        const mapsResult =
            await Map.updateMany(
                {
                    $or: [
                        { contractNumber: { $exists: false } },
                        { contractNumber: null },
                        { contractNumber: "" }
                    ]
                },
                {
                    $set: {
                        contractNumber: DEFAULT_CONTRACT.number
                    }
                }
            );

        const printersResult =
            await Printer.updateMany(
                {
                    $or: [
                        { contractNumber: { $exists: false } },
                        { contractNumber: null },
                        { contractNumber: "" }
                    ]
                },
                {
                    $set: {
                        contractNumber: DEFAULT_CONTRACT.number
                    }
                }
            );

        console.log("Contrato padrão criado/confirmado:");
        console.log(DEFAULT_CONTRACT);

        console.log("Mapas atualizados:", mapsResult.modifiedCount);
        console.log("Impressoras atualizadas:", printersResult.modifiedCount);

    } catch (error) {

        console.error(
            "Erro na migração:",
            error
        );

    } finally {

        await mongoose.disconnect();

        console.log("Conexão encerrada");

    }

}

run();