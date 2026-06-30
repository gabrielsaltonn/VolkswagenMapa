import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Map from "../models/Map.js";
import Printer from "../models/Printer.js";

import {
    DEFAULT_CONTRACT_NUMBER,
    getContractNumber,
    requireContractAccess,
    requireContractManager
} from "../utils/permissions.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

        const maps =
            await Map.find({
                contractNumber
            });

        res.json(maps);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.post("/", async (req, res) => {

    try {

        const contractNumber =
            getContractNumber(req);

        const permission =
            await requireContractManager(
                req,
                res,
                contractNumber
            );

        if (!permission) {
            return;
        }

        const {
            loggedUsername,
            userRole,
            userPlant,
            ...mapData
        } = req.body;

        const map =
            await Map.create({
                ...mapData,
                contractNumber
            });

        res.status(201).json(map);

    } catch (error) {

        if (error.code === 11000) {

            return res.status(400).json({
                erro: "Já existe uma planta com essa sigla neste contrato."
            });

        }

        res.status(500).json({
            erro: error.message
        });

    }

});

router.put("/:id", async (req, res) => {

    try {

        const currentMap =
            await Map.findById(
                req.params.id
            );

        if (!currentMap) {

            return res.status(404).json({
                erro: "Planta não encontrada"
            });

        }

        const contractNumber =
            currentMap.contractNumber ||
            req.body.contractNumber ||
            DEFAULT_CONTRACT_NUMBER;

        const permission =
            await requireContractManager(
                req,
                res,
                contractNumber
            );

        if (!permission) {
            return;
        }

        const updateData = {
            name: req.body.name,
            label: req.body.label,
            pages: req.body.pages,
            contractNumber
        };

        Object.keys(updateData).forEach(key => {

            if (updateData[key] === undefined) {
                delete updateData[key];
            }

        });

        const map =
            await Map.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true
                }
            );

        res.json(map);

    } catch (error) {

        if (error.code === 11000) {

            return res.status(400).json({
                erro: "Já existe uma planta com essa sigla neste contrato."
            });

        }

        res.status(500).json({
            erro: error.message
        });

    }

});

router.delete("/:id/pages/:pageIndex", async (req, res) => {

    try {

        const map =
            await Map.findById(req.params.id);

        if (!map) {

            return res.status(404).json({
                erro: "Planta não encontrada"
            });

        }

        const contractNumber =
            map.contractNumber ||
            DEFAULT_CONTRACT_NUMBER;

        const permission =
            await requireContractManager(
                req,
                res,
                contractNumber
            );

        if (!permission) {
            return;
        }

        const pageIndex =
            Number(req.params.pageIndex);

        if (
            Number.isNaN(pageIndex) ||
            pageIndex < 0 ||
            pageIndex >= map.pages.length
        ) {

            return res.status(400).json({
                erro: "Página inválida"
            });

        }

        if (map.pages.length <= 1) {

            return res.status(400).json({
                erro: "A planta precisa ter pelo menos uma página."
            });

        }

        const page =
            map.pages[pageIndex];

        const cleanPage =
            page.replace(/^\/+/, "");

        const imagePath =
            path.join(
                __dirname,
                "..",
                "public",
                cleanPage
            );

        try {

            await fs.unlink(imagePath);

            console.log(
                "Imagem da página apagada:",
                imagePath
            );

        } catch (error) {

            console.warn(
                "Não consegui apagar a imagem da página:",
                imagePath,
                error.message
            );

        }

        map.pages.splice(pageIndex, 1);

        await map.save();

        res.json({
            mensagem: "Página excluída com sucesso",
            map
        });

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

        const contractNumber =
            map.contractNumber ||
            DEFAULT_CONTRACT_NUMBER;

        const permission =
            await requireContractManager(
                req,
                res,
                contractNumber
            );

        if (!permission) {
            return;
        }

        await Printer.deleteMany({
            plant: map.name,
            contractNumber
        });

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