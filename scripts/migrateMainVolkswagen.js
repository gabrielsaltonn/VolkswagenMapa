import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "../models/User.js";
import Map from "../models/Map.js";
import Printer from "../models/Printer.js";
import Contract from "../models/Contract.js";

dotenv.config();

const isApply =
    process.argv.includes("--apply");

const isDryRun =
    !isApply;

const mongoUri =
    process.env.MONGO_URI_MAIN ||
    process.env.MONGO_URI;

const dbName =
    process.env.MIGRATION_DB_NAME ||
    process.env.MONGO_DB_MAIN ||
    "restore_test_vw_pre_migracao";

const vwContractNumber =
    process.env.VW_CONTRACT_NUMBER ||
    "7465";

const vwContractName =
    process.env.VW_CONTRACT_NAME ||
    "Volkswagen";

const gestoraEmail =
    String(
        process.env.GESTORA_EMAIL ||
        "lacoelho@simpress.com.br"
    )
        .trim()
        .toLowerCase();

const gestoraTempPassword =
    process.env.GESTORA_TEMP_PASSWORD ||
    "";

const resetGestoraPassword =
    process.env.RESET_GESTORA_PASSWORD === "true";

const legacyUsersMigration = [
    {
        username: "admin@simpress.com.br",
        role: "admin",
        plant: "ALL",
        accessRole: "admin",
        plants: ["ALL"]
    },
    {
        username: "gsddsantos@simpress.com.br",
        role: "user",
        plant: "SJP",
        accessRole: "user",
        plants: ["SJP"]
    },
    {
        username: "lmfortunato@simpress.com.br",
        role: "admin",
        plant: "TBT",
        accessRole: "admin",
        plants: ["TBT"]
    }
];

function section(title) {

    console.log("");
    console.log("========================================");
    console.log(title);
    console.log("========================================");

}

function normalizeUsername(username) {

    return String(username || "")
        .trim()
        .toLowerCase();

}

function accessFor(item) {

    return [
        {
            contractNumber: vwContractNumber,
            role: item.accessRole,
            plants: item.plants
        }
    ];

}

async function getPrinterCounts() {

    return Printer.aggregate([
        {
            $group: {
                _id: {
                    contractNumber: "$contractNumber",
                    plant: "$plant"
                },
                total: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                "_id.contractNumber": 1,
                "_id.plant": 1
            }
        }
    ]);

}

async function printDiagnostics(label) {

    section(label);

    const usersTotal =
        await User.countDocuments();

    const approvedUsers =
        await User.countDocuments({
            status: "approved"
        });

    const pendingUsers =
        await User.countDocuments({
            status: "pending"
        });

    const mapsTotal =
        await Map.countDocuments();

    const mapsWithoutContract =
        await Map.countDocuments({
            $or: [
                {
                    contractNumber: {
                        $exists: false
                    }
                },
                {
                    contractNumber: ""
                },
                {
                    contractNumber: null
                }
            ]
        });

    const printersTotal =
        await Printer.countDocuments();

    const printersWithoutContract =
        await Printer.countDocuments({
            $or: [
                {
                    contractNumber: {
                        $exists: false
                    }
                },
                {
                    contractNumber: ""
                },
                {
                    contractNumber: null
                }
            ]
        });

    const contract =
        await Contract.findOne({
            number: vwContractNumber
        }).lean();

    console.log({
        dbName,
        mode: isDryRun ? "DRY-RUN" : "APPLY",
        vwContractNumber,
        usersTotal,
        approvedUsers,
        pendingUsers,
        mapsTotal,
        mapsWithoutContract,
        printersTotal,
        printersWithoutContract,
        contractExists: Boolean(contract),
        contractManagers: contract?.managers || []
    });

    console.log("");
    console.log("Impressoras por contrato/planta:");

    const printerCounts =
        await getPrinterCounts();

    console.table(
        printerCounts.map(item => ({
            contractNumber:
                item._id.contractNumber || "(sem contrato)",
            plant:
                item._id.plant || "(sem planta)",
            total:
                item.total
        }))
    );

}

async function migrateContract() {

    section("Contrato VW");

    const existingContract =
        await Contract.findOne({
            number: vwContractNumber
        });

    if (!existingContract) {

        console.log(
            `Criaria contrato ${vwContractName} - ${vwContractNumber}`
        );

        if (!isDryRun) {

            await Contract.create({
                name: vwContractName,
                number: vwContractNumber,
                status: "active",
                createdBy: "migration",
                managers: gestoraEmail
                    ? [gestoraEmail]
                    : []
            });

        }

        return;

    }

    const managers =
        new Set(
            (existingContract.managers || [])
                .map(normalizeUsername)
        );

    if (gestoraEmail) {
        managers.add(gestoraEmail);
    }

    console.log(
        `Atualizaria contrato existente ${existingContract.name} - ${existingContract.number}`
    );

    if (!isDryRun) {

        existingContract.name =
            existingContract.name || vwContractName;

        existingContract.status =
            "active";

        existingContract.managers =
            [...managers];

        await existingContract.save();

    }

}

async function migrateMaps() {

    section("Mapas");

    const filter = {
        $or: [
            {
                contractNumber: {
                    $exists: false
                }
            },
            {
                contractNumber: ""
            },
            {
                contractNumber: null
            }
        ]
    };

    const total =
        await Map.countDocuments(filter);

    console.log(
        `Mapas sem contrato encontrados: ${total}`
    );

    if (!isDryRun) {

        await Map.updateMany(
            filter,
            {
                $set: {
                    contractNumber: vwContractNumber
                }
            }
        );

    }

}

async function migratePrinters() {

    section("Impressoras");

    const filter = {
        $or: [
            {
                contractNumber: {
                    $exists: false
                }
            },
            {
                contractNumber: ""
            },
            {
                contractNumber: null
            }
        ]
    };

    const total =
        await Printer.countDocuments(filter);

    console.log(
        `Impressoras sem contrato encontradas: ${total}`
    );

    if (!isDryRun) {

        await Printer.updateMany(
            filter,
            {
                $set: {
                    contractNumber: vwContractNumber
                }
            }
        );

    }

}

async function migrateLegacyUsers() {

    section("Usuários legados");

    for (const item of legacyUsersMigration) {

        const username =
            normalizeUsername(item.username);

        const user =
            await User.findOne({
                username
            });

        if (!user) {

            console.log(
                `Usuário não encontrado: ${username}`
            );

            continue;

        }

        const nextAccess =
            accessFor(item);

        console.log(
            `Atualizaria ${username}`,
            {
                role: item.role,
                plant: item.plant,
                access: nextAccess
            }
        );

        if (!isDryRun) {

            await User.updateOne(
                {
                    _id: user._id
                },
                {
                    $set: {
                        role: item.role,
                        plant: item.plant,
                        status: "approved",
                        requestedContractNumber: "",
                        access: nextAccess
                    }
                }
            );

        }

    }

}

async function migrateGestora() {

    section("Gestora VW");

    if (!gestoraEmail) {

        console.log(
            "Nenhuma gestora informada."
        );

        return;

    }

    const existingGestora =
        await User.findOne({
            username: gestoraEmail
        });

    if (!existingGestora && !gestoraTempPassword) {

        console.log(
            `Gestora ${gestoraEmail} não existe. Para criar no APPLY, informe GESTORA_TEMP_PASSWORD.`
        );

        return;

    }

    if (!existingGestora) {

        console.log(
            `Criaria gestora ${gestoraEmail}`
        );

        if (!isDryRun) {

            const hashedPassword =
                await bcrypt.hash(
                    gestoraTempPassword,
                    10
                );

            await User.create({
                username: gestoraEmail,
                password: hashedPassword,
                role: "gestor",
                plant: "",
                requestedContractNumber: "",
                access: [],
                status: "approved"
            });

        }

        return;

    }

    const update = {
        role: "gestor",
        plant: "",
        requestedContractNumber: "",
        access: [],
        status: "approved"
    };

    if (
        gestoraTempPassword &&
        resetGestoraPassword
    ) {

        update.password =
            await bcrypt.hash(
                gestoraTempPassword,
                10
            );

    }

    console.log(
        `Atualizaria gestora existente ${gestoraEmail}`,
        {
            ...update,
            password: update.password
                ? "(resetada)"
                : "(mantida)"
        }
    );

    if (!isDryRun) {

        await User.updateOne(
            {
                _id: existingGestora._id
            },
            {
                $set: update
            }
        );

    }

}

async function run() {

    if (!mongoUri) {

        throw new Error(
            "Informe MONGO_URI_MAIN ou MONGO_URI."
        );

    }

    console.log("");
    console.log(
        isDryRun
            ? "MODO DRY-RUN: nada será alterado."
            : "MODO APPLY: alterações serão gravadas."
    );

    console.log(`Banco alvo: ${dbName}`);

    if (
        isApply &&
        dbName === "printermap"
    ) {

        console.log("");
        console.log("ATENÇÃO: você está mirando a MAIN real.");
        console.log("Só continue se o dry-run e o apply no restore já foram validados.");
        console.log("");

    }

    await mongoose.connect(
        mongoUri,
        {
            dbName
        }
    );

    await printDiagnostics(
        "Antes da migração"
    );

    await migrateContract();

    await migrateMaps();

    await migratePrinters();

    await migrateLegacyUsers();

    await migrateGestora();

    await printDiagnostics(
        "Depois da migração"
    );

    await mongoose.disconnect();

    console.log("");
    console.log(
        isDryRun
            ? "Dry-run concluído. Nenhuma alteração foi gravada."
            : "Migração aplicada com sucesso."
    );

}

run().catch(async error => {

    console.error("");
    console.error("Erro na migração:");
    console.error(error);

    await mongoose.disconnect();

    process.exit(1);

});