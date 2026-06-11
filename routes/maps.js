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

        res.status(500).json({
            erro: error.message
        });

    }

});

export default router;