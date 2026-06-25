import express from "express";
import Contract from "../models/Contract.js";
import User from "../models/User.js";

const router = express.Router();

const SUPER_ADMIN_USERS = [
    "admin@simpress.com.br",
    "admin.dev@simpress.com.br"
];

function normalizeUsername(username) {

    return String(username || "")
        .trim()
        .toLowerCase();

}

async function getRequester(loggedUsername) {

    const username =
        normalizeUsername(loggedUsername);

    if (!username) {
        return null;
    }

    return await User.findOne({
        username,
        status: "approved"
    });

}

function isSuperAdmin(user) {

    if (!user) {
        return false;
    }

    return SUPER_ADMIN_USERS.includes(
        normalizeUsername(user.username)
    );

}

async function requireSuperAdmin(req, res) {

    const loggedUsername =
        req.body.loggedUsername ||
        req.query.loggedUsername;

    const requester =
        await getRequester(loggedUsername);

    if (!isSuperAdmin(requester)) {

        res.status(403).json({
            erro: "Apenas o administrador principal pode executar esta ação."
        });

        return null;

    }

    return requester;

}

// Listar contratos
router.get("/", async (req, res) => {

    try {

        const contracts =
            await Contract.find({
                status: "active"
            }).sort({
                name: 1
            });

        res.json(contracts);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

// Criar contrato
router.post("/", async (req, res) => {

    try {

        const requester =
            await requireSuperAdmin(
                req,
                res
            );

        if (!requester) {
            return;
        }

        const name =
            req.body.name
                ?.trim();

        const number =
            req.body.number
                ?.trim();

        if (!name || !number) {

            return res.status(400).json({
                erro: "Nome e número do contrato são obrigatórios."
            });

        }

        const existingContract =
            await Contract.findOne({
                number
            });

        if (existingContract) {

            return res.status(400).json({
                erro: "Já existe um contrato com este número."
            });

        }

        const contract =
            await Contract.create({
                name,
                number,
                status: "active"
            });

        res.status(201).json({
            mensagem: "Contrato criado com sucesso.",
            contract
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

// Editar contrato
router.put("/:id", async (req, res) => {

    try {

        const requester =
            await requireSuperAdmin(
                req,
                res
            );

        if (!requester) {
            return;
        }

        const name =
            req.body.name
                ?.trim();

        const number =
            req.body.number
                ?.trim();

        const status =
            req.body.status;

        const updateData = {};

        if (name) {
            updateData.name = name;
        }

        if (number) {
            updateData.number = number;
        }

        if (status) {

            if (
                status !== "active" &&
                status !== "inactive"
            ) {

                return res.status(400).json({
                    erro: "Status inválido."
                });

            }

            updateData.status = status;

        }

        const contract =
            await Contract.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true
                }
            );

        if (!contract) {

            return res.status(404).json({
                erro: "Contrato não encontrado."
            });

        }

        res.json({
            mensagem: "Contrato atualizado com sucesso.",
            contract
        });

    } catch (error) {

        if (error.code === 11000) {

            return res.status(400).json({
                erro: "Já existe um contrato com este número."
            });

        }

        res.status(500).json({
            erro: error.message
        });

    }

});

export default router;