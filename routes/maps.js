import express from "express";
import Map from "../models/Map.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const maps =
            await Map.find();

        res.json(maps);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.post("/", async (req, res) => {

    try {

        const map =
            await Map.create(req.body);

        res.status(201).json(map);

    } catch (error) {

        if (error.code === 11000) {

            return res.status(400).json({
                erro: "Já existe uma planta com essa sigla."
            });

        }

        res.status(500).json({
            erro: error.message
        });

    }

});

router.put("/:id", async (req, res) => {

    try {

        const map =
            await Map.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true
                }
            );

        res.json(map);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.delete("/:id", async (req, res) => {

    try {

        await Map.findByIdAndDelete(
            req.params.id
        );

        res.json({
            mensagem: "Planta excluída"
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

export default router;