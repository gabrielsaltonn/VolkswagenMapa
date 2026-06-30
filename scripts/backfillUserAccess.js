import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User.js";

dotenv.config();

const DEFAULT_CONTRACT_NUMBER =
    "1234";

function buildAccessFromLegacyUser(user) {

    const role =
        user.role === "admin"
            ? "admin"
            : "user";

    const plant =
        user.plant || "SJP";

    return [
        {
            contractNumber: DEFAULT_CONTRACT_NUMBER,
            role,
            plants: [plant]
        }
    ];

}

async function run() {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("Conectado ao MongoDB");

        const users =
            await User.find({
                $or: [
                    { access: { $exists: false } },
                    { access: { $size: 0 } }
                ]
            });

        console.log(
            "Usuários encontrados para atualização:",
            users.length
        );

        for (const user of users) {

            user.access =
                buildAccessFromLegacyUser(user);

            await user.save();

            console.log(
                `Usuário atualizado: ${user.username}`
            );

        }

        console.log("Backfill de acessos concluído.");

    } catch (error) {

        console.error(
            "Erro no backfill de usuários:",
            error
        );

    } finally {

        await mongoose.disconnect();

        console.log("Conexão encerrada");

    }

}

run();