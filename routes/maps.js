import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Map from "../models/Map.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    console.log("EXCLUINDO PLANTA:", req.params.id);

    try {

        const map =
            await Map.findById(req.params.id);

        if (!map) {

            return res.status(404).json({
                erro: "Planta não encontrada"
            });

        }

        for (const page of map.pages) {

            const cleanPage =
                page.replace(/^\/+/, "");

            const imagePath =
                path.join(
                    __dirname,
                    "..",
                    "public",
                    cleanPage
                );

            console.log("Tentando apagar:", imagePath);

            try {

                await fs.unlink(imagePath);

                console.log("Imagem apagada:", imagePath);

            } catch (error) {

                console.warn(
                    "Não consegui apagar a imagem:",
                    imagePath,
                    error.message
                );

            }

        }

        await Map.findByIdAndDelete(req.params.id);

        res.json({
            mensagem: "Planta e imagens excluídas"
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

export default router;