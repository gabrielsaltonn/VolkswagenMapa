import express from "express";
import Printer from "../models/Printer.js";

const router = express.Router();

function canEditPlant(userRole, userPlant, targetPlant) {

    if (userRole === "admin") {
        return true;
    }

    return userPlant === targetPlant;

}

router.get("/", async (req, res) => {

    const printers = await Printer.find();

    res.json(printers);

});

router.post("/", async (req, res) => {

    const { userRole, userPlant, plant } = req.body;

    if (!canEditPlant(userRole, userPlant, plant)) {

        return res.status(403).json({
            erro: "Você não tem permissão para adicionar impressoras nesta planta."
        });

    }

    const printer = await Printer.create(req.body);

    res.status(201).json(printer);

});

router.put("/:id", async (req, res) => {

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
            req.body,
            {
                new: true
            }
        );

    res.json(updatedPrinter);

});

router.delete("/:id", async (req, res) => {

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

});

export default router;