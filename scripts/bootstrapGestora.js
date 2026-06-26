import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import User from "../models/User.js";
import Contract from "../models/Contract.js";

dotenv.config();

function normalizeUsername(username) {

    return String(username || "")
        .trim()
        .toLowerCase();

}

function normalizeContractNumber(number) {

    return String(number || "")
        .trim();

}

function validateEnv() {

    const gestoraEmail =
        normalizeUsername(
            process.env.GESTORA_EMAIL
        );

    const gestoraTempPassword =
        String(
            process.env.GESTORA_TEMP_PASSWORD || ""
        );

    const vwContractNumber =
        normalizeContractNumber(
            process.env.VW_CONTRACT_NUMBER
        );

    if (!gestoraEmail) {
        throw new Error(
            "GESTORA_EMAIL não informado no .env"
        );
    }

    if (!gestoraTempPassword) {
        throw new Error(
            "GESTORA_TEMP_PASSWORD não informado no .env"
        );
    }

    if (!vwContractNumber) {
        throw new Error(
            "VW_CONTRACT_NUMBER não informado no .env"
        );
    }

    return {
        gestoraEmail,
        gestoraTempPassword,
        vwContractNumber
    };

}

async function upsertGestora(
    gestoraEmail,
    gestoraTempPassword
) {

    let user =
        await User.findOne({
            username: gestoraEmail
        });

    if (!user) {

        const hashedPassword =
            await bcrypt.hash(
                gestoraTempPassword,
                10
            );

        user =
            await User.create({
                username: gestoraEmail,
                password: hashedPassword,
                role: "gestor",
                plant: "",
                access: [],
                status: "approved"
            });

        console.log(
            "Gestora criada:",
            gestoraEmail
        );

        return user;

    }

    user.role =
        "gestor";

    user.plant =
        "";

    user.access =
        [];

    user.status =
        "approved";

    if (
        process.env.RESET_GESTORA_PASSWORD === "true"
    ) {

        user.password =
            await bcrypt.hash(
                gestoraTempPassword,
                10
            );

        console.log(
            "Senha provisória da gestora redefinida."
        );

    }

    await user.save();

    console.log(
        "Gestora atualizada/aprovada:",
        gestoraEmail
    );

    return user;

}

async function linkVolkswagenContract(
    gestoraEmail,
    vwContractNumber
) {

    const contract =
        await Contract.findOne({
            number: vwContractNumber
        });

    if (!contract) {

        throw new Error(
            `Contrato VW não encontrado com o número ${vwContractNumber}. Nenhuma alteração foi feita no contrato.`
        );

    }

    const managers =
        [
            ...new Set([
                ...(contract.managers || []),
                gestoraEmail
            ])
        ];

    contract.managers =
        managers;

    if (!contract.createdBy) {
        contract.createdBy =
            gestoraEmail;
    }

    await contract.save();

    console.log(
        "Contrato VW vinculado à gestora:"
    );

    console.log({
        name: contract.name,
        number: contract.number,
        managers: contract.managers
    });

    return contract;

}

async function run() {

    try {

        const {
            gestoraEmail,
            gestoraTempPassword,
            vwContractNumber
        } = validateEnv();

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "Conectado ao MongoDB"
        );

        const vwContract =
            await Contract.findOne({
                number: vwContractNumber
            });

        if (!vwContract) {

            throw new Error(
                `Contrato VW não encontrado com o número ${vwContractNumber}. Nenhuma alteração foi feita.`
            );

        }

        await upsertGestora(
            gestoraEmail,
            gestoraTempPassword
        );

        await linkVolkswagenContract(
            gestoraEmail,
            vwContractNumber
        );

        console.log(
            "Bootstrap finalizado com sucesso."
        );

    } catch (error) {

        console.error(
            "Erro no bootstrap da gestora:",
            error.message
        );

        process.exitCode =
            1;

    } finally {

        await mongoose.disconnect();

        console.log(
            "Conexão encerrada"
        );

    }

}

run();