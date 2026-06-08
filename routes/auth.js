import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {

    try {

        const { username, password } = req.body;

        const existingUser =
            await User.findOne({ username });

        if (existingUser) {

            return res.status(400).json({
                mensagem: "Usuário já existe"
            });

        }

        const user =
            await User.create({
                username,
                password,
                role: "user",
                plant: "SJP",
                status: "pending"
            });

        res.status(201).json({
            mensagem: "Usuário criado",
            user
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        const user =
            await User.findOne({ username });

        if (!user) {

            return res.status(400).json({
                mensagem: "Usuário não encontrado"
            });

        }

        if (user.password !== password) {

            return res.status(400).json({
                mensagem: "Senha incorreta"
            });

        }

        if (user.status !== "approved") {

            return res.status(403).json({
                mensagem: "Usuário aguardando aprovação"
            });

        }

        res.json({
            mensagem: "Login realizado",
            user: {
                username: user.username,
                role: user.role,
                plant: user.plant,
                status: user.status
            }
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

export default router;