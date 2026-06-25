import express from "express";
import Printer from "../models/Printer.js";

const router = express.Router();

const DEFAULT_CONTRACT_NUMBER = "1234";

function getContractNumber(req) {

    return String(
        req.query.contractNumber ||
        req.body.contractNumber ||
        DEFAULT_CONTRACT_NUMBER
    ).trim();

}

function canEditPlant(userRole, userPlant, targetPlant) {

    if (userRole === "admin") {
        return true;
    }

    return userPlant === targetPlant;

}

router.get("/", async (req, res) => {

    try {

        const contractNumber =
            getContractNumber(req);

        const printers =
            await Printer.find({
                contractNumber
            });

        res.json(printers);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.post("/", async (req, res) => {

    try {

        const {
            userRole,
            userPlant,
            plant
        } = req.body;

        if (!canEditPlant(userRole, userPlant, plant)) {

            return res.status(403).json({
                erro: "Você não tem permissão para adicionar impressoras nesta planta."
            });

        }

        const contractNumber =
            getContractNumber(req);

        const printer =
            await Printer.create({
                ...req.body,
                contractNumber
            });

        res.status(201).json(printer);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.put("/:id", async (req, res) => {

    try {

        const printer =
            await Printer.findById(
                req.params.id
            );

        if (!printer) {

            return res.status(404).json({
                erro: "Impressora não encontrada"
            });

        }

        const {
            userRole,
            userPlant
        } = req.body;

        if (
            !canEditPlant(
                userRole,
                userPlant,
                printer.plant
            )
        ) {

            return res.status(403).json({
                erro:
                    "Você não tem permissão para alterar esta impressora."
            });

        }

        const updatedPrinter =
            await Printer.findByIdAndUpdate(
                req.params.id,
                {
                    ...req.body,
                    contractNumber:
                        req.body.contractNumber ||
                        printer.contractNumber ||
                        DEFAULT_CONTRACT_NUMBER
                },
                {
                    new: true
                }
            );

        res.json(updatedPrinter);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.delete("/:id", async (req, res) => {

    try {

        const printer =
            await Printer.findById(
                req.params.id
            );

        if (!printer) {

            return res.status(404).json({
                erro: "Impressora não encontrada"
            });

        }

        const {
            userRole,
            userPlant
        } = req.body;

        if (
            !canEditPlant(
                userRole,
                userPlant,
                printer.plant
            )
        ) {

            return res.status(403).json({
                erro:
                    "Você não tem permissão para excluir esta impressora."
            });

        }

        await Printer.findByIdAndDelete(
            req.params.id
        );

        res.status(204).send();

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

export default router;