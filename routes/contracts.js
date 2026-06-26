import express from "express";
import Contract from "../models/Contract.js";

import {
    getRequester,
    isSuperAdmin,
    isGestor,
    canCreateContracts,
    normalizeUsername
} from "../utils/permissions.js";

const router = express.Router();

function normalizeManagers(managers) {

    if (!Array.isArray(managers)) {
        return [];
    }

    return [
        ...new Set(
            managers
                .map(manager =>
                    normalizeUsername(manager)
                )
                .filter(Boolean)
        )
    ];

}

router.get("/", async (req, res) => {

    try {

        const requester =
            await getRequester(req);

        if (!requester) {

            return res.status(401).json({
                erro: "Usuário autenticado não informado ou não aprovado."
            });

        }

        let filter = {};

        if (isGestor(requester)) {

            filter.managers =
                normalizeUsername(requester.username);

        }

        if (
            !isSuperAdmin(requester) &&
            !isGestor(requester)
        ) {

            const contractNumbers =
                [
                    ...new Set(
                        (requester.access || [])
                            .map(accessItem =>
                                accessItem.contractNumber
                            )
                            .filter(Boolean)
                    )
                ];

            filter.number = {
                $in: contractNumbers
            };

        }

        const contracts =
            await Contract.find(filter)
                .sort({
                    name: 1
                });

        res.json(contracts);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.post("/", async (req, res) => {

    try {

        const requester =
            await getRequester(req);

        if (!requester) {

            return res.status(401).json({
                erro: "Usuário autenticado não informado ou não aprovado."
            });

        }

        if (!canCreateContracts(requester)) {

            return res.status(403).json({
                erro: "Apenas gestores ou administradores principais podem criar contratos."
            });

        }

        const name =
            String(req.body.name || "")
                .trim();

        const number =
            String(req.body.number || "")
                .trim();

        if (!name || !number) {

            return res.status(400).json({
                erro: "Nome e número do contrato são obrigatórios."
            });

        }

        let managers = [];

        if (isSuperAdmin(requester)) {

            managers =
                normalizeManagers(
                    req.body.managers
                );

        }

        if (isGestor(requester)) {

            managers =
                [
                    normalizeUsername(requester.username)
                ];

        }

        if (managers.length === 0) {

            managers =
                [
                    normalizeUsername(requester.username)
                ];

        }

        const contract =
            await Contract.create({
                name,
                number,
                status: "active",
                createdBy:
                    normalizeUsername(requester.username),
                managers
            });

        res.status(201).json(contract);

    } catch (error) {

        if (error.code === 11000) {

            return res.status(400).json({
                erro: "Já existe um contrato com esse número."
            });

        }

        res.status(500).json({
            erro: error.message
        });

    }

});

router.put("/:id", async (req, res) => {

    try {

        const requester =
            await getRequester(req);

        if (!requester) {

            return res.status(401).json({
                erro: "Usuário autenticado não informado ou não aprovado."
            });

        }

        const contract =
            await Contract.findById(
                req.params.id
            );

        if (!contract) {

            return res.status(404).json({
                erro: "Contrato não encontrado."
            });

        }

        const isContractManager =
            contract.managers.includes(
                normalizeUsername(requester.username)
            );

        if (
            !isSuperAdmin(requester) &&
            !isContractManager
        ) {

            return res.status(403).json({
                erro: "Você não tem permissão para editar este contrato."
            });

        }

        if (req.body.name !== undefined) {

            contract.name =
                String(req.body.name || "")
                    .trim();

        }

        if (req.body.status !== undefined) {

            const status =
                String(req.body.status || "")
                    .trim();

            if (
                status !== "active" &&
                status !== "inactive"
            ) {

                return res.status(400).json({
                    erro: "Status inválido."
                });

            }

            contract.status =
                status;

        }

        if (
            isSuperAdmin(requester) &&
            req.body.managers !== undefined
        ) {

            contract.managers =
                normalizeManagers(
                    req.body.managers
                );

        }

        await contract.save();

        res.json(contract);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

export default router;