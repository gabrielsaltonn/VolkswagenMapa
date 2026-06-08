import express from "express";
import QuickLink from "../models/QuickLink.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const quickLinks =
            await QuickLink.find();

        res.json(quickLinks);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.post("/", async (req, res) => {

    try {

        const quickLink =
            await QuickLink.create(req.body);

        res.status(201).json(quickLink);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.delete("/:id", async (req, res) => {

    try {

        await QuickLink.findByIdAndDelete(
            req.params.id
        );

        res.json({
            mensagem: "Atalho excluído"
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.put("/:id", async (req, res) => {

    try {

        const quickLink =
            await QuickLink.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true
                }
            );

        res.json(quickLink);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

export default router;