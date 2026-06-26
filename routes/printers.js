import express from "express";
import Printer from "../models/Printer.js";

import {
    DEFAULT_CONTRACT_NUMBER,
    getContractNumber,
    requireContractAccess,
    requirePlantEditor
} from "../utils/permissions.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const contractNumber =
            getContractNumber(req);

        const permission =
            await requireContractAccess(
                req,
                res,
                contractNumber
            );

        if (!permission) {
            return;
        }

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
            plant
        } = req.body;

        if (!plant) {

            return res.status(400).json({
                erro: "Planta é obrigatória."
            });

        }

        const contractNumber =
            getContractNumber(req);

        const permission =
            await requirePlantEditor(
                req,
                res,
                contractNumber,
                plant
            );

        if (!permission) {
            return;
        }

        const {
            loggedUsername,
            userRole,
            userPlant,
            ...printerData
        } = req.body;

        const printer =
            await Printer.create({
                ...printerData,
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

        const contractNumber =
            printer.contractNumber ||
            req.body.contractNumber ||
            DEFAULT_CONTRACT_NUMBER;

        const currentPlant =
            printer.plant;

        const targetPlant =
            req.body.plant ||
            printer.plant;

        const currentPlantPermission =
            await requirePlantEditor(
                req,
                res,
                contractNumber,
                currentPlant
            );

        if (!currentPlantPermission) {
            return;
        }

        if (targetPlant !== currentPlant) {

            const targetPlantPermission =
                await requirePlantEditor(
                    req,
                    res,
                    contractNumber,
                    targetPlant
                );

            if (!targetPlantPermission) {
                return;
            }

        }

        const {
            loggedUsername,
            userRole,
            userPlant,
            ...printerData
        } = req.body;

        const updatedPrinter =
            await Printer.findByIdAndUpdate(
                req.params.id,
                {
                    ...printerData,
                    contractNumber
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

        const contractNumber =
            printer.contractNumber ||
            DEFAULT_CONTRACT_NUMBER;

        const permission =
            await requirePlantEditor(
                req,
                res,
                contractNumber,
                printer.plant
            );

        if (!permission) {
            return;
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