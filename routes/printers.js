import express from "express";
import Printer from "../models/Printer.js";

const router = express.Router();

router.get("/", async (req, res) => {

    const printers = await Printer.find();

    res.json(printers);

});

router.post("/", async (req, res) => {

    const printer = await Printer.create(req.body);

    res.status(201).json(printer);
});

router.put("/:id", async (req, res) => {

    const printer = await Printer.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true
        }
    );

    if (!printer) {
        return res.status(404).json({
            erro: "Impressora não encontrada"
        });
    }

    res.json(printer);
});

router.delete("/:id", async (req, res) => {

    const printer = await Printer.findByIdAndDelete(
        req.params.id
    );

    if (!printer) {
        return res.status(404).json({
            erro: "Impressora não encontrada"
        });
    }

    res.status(204).send();
});

export default router;