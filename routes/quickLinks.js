import express from "express";
import QuickLink from "../models/QuickLink.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const { user } = req.query;

        const filtro = user ? { user } : {};

        const quickLinks =
            await QuickLink.find(filtro);

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

        await QuickLink.findOneAndDelete({
            _id: req.params.id,
            user: req.body.user
        });

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
            await QuickLink.findOneAndUpdate(
                {
                    _id: req.params.id,
                    user: req.body.user
                },
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