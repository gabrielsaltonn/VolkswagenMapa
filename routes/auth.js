import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Contract from "../models/Contract.js";

import {
    DEFAULT_CONTRACT_NUMBER,
    getRequester,
    isSuperAdmin,
    normalizeUsername
} from "../utils/permissions.js";

const router = express.Router();

const VALID_ACCESS_ROLES = [
    "user",
    "admin"
]

function normalizePlants(plants) {

    if (!Array.isArray(plants)) {
        return [];
    }

    const normalizedPlants =
        plants
            .map(plant =>
                String(plant || "")
                    .trim()
                    .toUpperCase()
            )
            .filter(Boolean);

    const uniquePlants =
        [...new Set(normalizedPlants)];

    if (uniquePlants.includes("ALL")) {
        return ["ALL"];
    }

    return uniquePlants;

}

function normalizeAccessList(accessList) {

    if (!Array.isArray(accessList)) {

        return {
            error: "A lista de acessos é obrigatória."
        };

    }

    if (accessList.length === 0) {

        return {
            error: "O usuário precisa ter pelo menos um acesso."
        };

    }

    const usedContracts =
        new Set();

    const normalizedAccess = [];

    for (const accessItem of accessList) {

        const contractNumber =
            String(accessItem.contractNumber || "")
                .trim();

        const role =
            String(accessItem.role || "")
                .trim()
                .toLowerCase();

        const plants =
            normalizePlants(accessItem.plants);

        if (!contractNumber) {

            return {
                error: "Número do contrato é obrigatório."
            };

        }

        if (usedContracts.has(contractNumber)) {

            return {
                error: `Contrato duplicado na lista de acessos: ${contractNumber}.`
            };

        }

        if (!VALID_ACCESS_ROLES.includes(role)) {

            return {
                error: `Role inválida para o contrato ${contractNumber}.`
            };

        }

        if (plants.length === 0) {

            return {
                error: `Informe pelo menos uma planta para o contrato ${contractNumber}.`
            };

        }

        usedContracts.add(contractNumber);

        normalizedAccess.push({
            contractNumber,
            role,
            plants
        });

    }

    return {
        access: normalizedAccess
    };

}

function syncLegacyFieldsFromAccess(user) {

    const defaultAccess =
        user.access.find(accessItem =>
            accessItem.contractNumber === DEFAULT_CONTRACT_NUMBER
        ) || user.access[0];

    if (!defaultAccess) {
        return;
    }

    user.role =
        defaultAccess.role === "user"
            ? "user"
            : "admin";

    user.plant =
        defaultAccess.plants.includes("ALL")
            ? "ALL"
            : defaultAccess.plants[0] || "SJP";

}

router.post("/register", async (req, res) => {

    try {

        const username =
            req.body.username
                ?.trim()
                .toLowerCase();

        const password =
            req.body.password;

        if (!username || !password) {

            return res.status(400).json({
                mensagem: "Usuário e senha são obrigatórios"
            });

        }

        if (!username.endsWith("@simpress.com.br")) {

            return res.status(400).json({
                mensagem: "Use seu e-mail corporativo @simpress.com.br"
            });

        }

        const existingUser =
            await User.findOne({
                username
            });

        if (existingUser) {

            return res.status(400).json({
                mensagem: "Usuário já existe"
            });

        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        const newUser =
            await User.create({
                username,
                password: hashedPassword,
                role: "user",
                plant: "",
                access: [],
                status: "pending"
            });

        res.status(201).json({
            mensagem: "Usuário criado",
            user: newUser
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.post("/login", async (req, res) => {

    try {

        const username =
            req.body.username
                ?.trim()
                .toLowerCase();

        const password =
            req.body.password;

        if (!username || !password) {

            return res.status(400).json({
                mensagem: "Usuário e senha são obrigatórios"
            });

        }

        const user =
            await User.findOne({
                username
            });

        if (!user) {

            return res.status(400).json({
                mensagem: "Usuário não encontrado"
            });

        }

        const validPassword =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!validPassword) {

            return res.status(400).json({
                mensagem: "Senha incorreta"
            });

        }

        if (user.status !== "approved") {

            return res.status(403).json({
                mensagem: "Usuário aguardando aprovação"
            });

        }

        const access =
            user.access && user.access.length > 0
                ? user.access
                : [
                    {
                        contractNumber: "1234",
                        role: user.role,
                        plants: [user.plant || "SJP"]
                    }
                ];

        res.json({
            mensagem: "Login realizado",
            user: {
                username: user.username,
                role: user.role,
                plant: user.plant,
                access,
                status: user.status
            }
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.get("/pending", async (req, res) => {

    try {

        const users =
            await User.find({
                status: "pending"
            });

        res.json(users);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.patch("/approve/:id", async (req, res) => {

    try {

        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {

            return res.status(404).json({
                erro: "Usuário não encontrado"
            });

        }

        if (
            user.role !== "gestor" &&
            (
                !user.access ||
                user.access.length === 0
            )
        ) {

            return res.status(400).json({
                erro: "Defina pelo menos um contrato antes de aprovar o usuário."
            });

        }

        user.status =
            "approved";

        await user.save();

        res.json({
            mensagem: "Usuário aprovado",
            user
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.patch("/reject/:id", async (req, res) => {

    try {

        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {

            return res.status(404).json({
                erro: "Usuário não encontrado"
            });

        }

        if (user.status !== "pending") {

            return res.status(400).json({
                erro: "Apenas usuários pendentes podem ser rejeitados."
            });

        }

        await User.findByIdAndDelete(
            req.params.id
        );

        res.json({
            mensagem: "Usuário rejeitado e removido do banco."
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.patch("/role/:id", async (req, res) => {

    try {

        const { role } = req.body;

        if (
            role !== "admin" &&
            role !== "user" &&
            role !== "gestor"
        ) {

            return res.status(400).json({
                erro: "Role inválida"
            });

        }

        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {

            return res.status(404).json({
                erro: "Usuário não encontrado"
            });

        }

        user.role =
            role;

        if (role === "gestor") {

            user.plant =
                "";

            user.access =
                [];

            await user.save();

            return res.json({
                mensagem: "Role atualizada",
                user
            });

        }

        const defaultAccess =
            user.access.find(accessItem =>
                accessItem.contractNumber === "1234"
            );

        if (defaultAccess) {

            defaultAccess.role =
                role;

        } else {

            user.access.push({
                contractNumber: "1234",
                role,
                plants: [user.plant || "SJP"]
            });

        }

        await user.save();

        res.json({
            mensagem: "Role atualizada",
            user
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.patch("/plant/:id", async (req, res) => {

    try {

        const { plant } = req.body;

        const validPlants = [
            "ANC",
            "SCAR",
            "SJP",
            "TAUB",
            "VIN",
            "ALL"
        ];

        if (!validPlants.includes(plant)) {

            return res.status(400).json({
                erro: "Planta inválida"
            });

        }

        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {

            return res.status(404).json({
                erro: "Usuário não encontrado"
            });

        }

        user.plant =
            plant;

        const defaultAccess =
            user.access.find(accessItem =>
                accessItem.contractNumber === "1234"
            );

        if (defaultAccess) {

            defaultAccess.plants =
                [plant];

        } else {

            user.access.push({
                contractNumber: "1234",
                role: user.role || "user",
                plants: [plant]
            });

        }

        await user.save();

        res.json({
            mensagem: "Planta atualizada",
            user
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.patch("/access/:id", async (req, res) => {

    try {

        const requester =
            await getRequester(req);

        if (!requester) {

            return res.status(401).json({
                erro: "Usuário autenticado não informado ou não aprovado."
            });

        }

        if (!isSuperAdmin(requester)) {

            return res.status(403).json({
                erro: "Apenas o administrador principal pode alterar acessos de contratos."
            });

        }

        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {

            return res.status(404).json({
                erro: "Usuário não encontrado"
            });

        }

        if (
            normalizeUsername(user.username) ===
            normalizeUsername(requester.username)
        ) {

            return res.status(403).json({
                erro: "Você não pode alterar os próprios acessos."
            });

        }

        const {
            access,
            error
        } = normalizeAccessList(
            req.body.access
        );

        if (error) {

            return res.status(400).json({
                erro: error
            });

        }

        const requestedContractNumbers =
            access.map(accessItem =>
                accessItem.contractNumber
            );

        const existingContracts =
            await Contract.find({
                number: {
                    $in: requestedContractNumbers
                },
                status: "active"
            });

        const existingContractNumbers =
            existingContracts.map(contract =>
                contract.number
            );

        const invalidContracts =
            requestedContractNumbers.filter(contractNumber =>
                !existingContractNumbers.includes(contractNumber)
            );

        if (invalidContracts.length > 0) {

            return res.status(400).json({
                erro: `Contrato(s) inválido(s) ou inativo(s): ${invalidContracts.join(", ")}.`
            });

        }

        user.access =
            access;

        syncLegacyFieldsFromAccess(user);

        await user.save();

        const safeUser =
            user.toObject();

        delete safeUser.password;

        res.json({
            mensagem: "Acessos atualizados com sucesso.",
            user: safeUser
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.delete("/users/:id", async (req, res) => {

    try {

        const { loggedUsername } = req.body;

        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {

            return res.status(404).json({
                erro: "Usuário não encontrado"
            });

        }

        if (user.username === loggedUsername) {

            return res.status(403).json({
                erro: "Você não pode excluir sua própria conta."
            });

        }

        await User.findByIdAndDelete(
            req.params.id
        );

        res.json({
            mensagem: "Usuário deletado"
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.get("/users", async (req, res) => {

    try {

        const users =
            await User.find({
                status: "approved"
            }).select("-password");

        res.json(users);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

export default router;