import express from "express";
import bcrypt from "bcrypt";
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

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user =
            await User.create({
                username,
                password: hashedPassword,
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

        const validPassword =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!validPassword) {

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

router.get("/pending", async (req, res) => {

    try {

        const users =
            await User.find({
                status: "pending"
            });

        res.json(users);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.patch("/approve/:id", async (req, res) => {

    try {

        const user =
            await User.findByIdAndUpdate(
                req.params.id,
                {
                    status: "approved"
                },
                {
                    new: true
                }
            );

        if (!user) {

            return res.status(404).json({
                erro: "Usuário não encontrado"
            });

        }

        res.json({
            mensagem: "Usuário aprovado",
            user
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.patch("/reject/:id", async (req, res) => {

    try {

        const user =
            await User.findByIdAndUpdate(
                req.params.id,
                {
                    status: "rejected"
                },
                {
                    new: true
                }
            );

        if (!user) {

            return res.status(404).json({
                erro: "Usuário não encontrado"
            });

        }

        res.json({
            mensagem: "Usuário rejeitado",
            user
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.patch("/role/:id", async (req, res) => {

    try {

        const { role } = req.body;

        if (
            role !== "admin" &&
            role !== "user"
        ) {

            return res.status(400).json({
                erro: "Role inválida"
            });

        }

        const user =
            await User.findByIdAndUpdate(
                req.params.id,
                {
                    role
                },
                {
                    new: true
                }
            );

        if (!user) {

            return res.status(404).json({
                erro: "Usuário não encontrado"
            });

        }

        res.json({
            mensagem: "Role atualizada",
            user
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.patch("/plant/:id", async (req, res) => {

    try {

        const { plant } = req.body;

        const validPlants = [
            "ANC",
            "SCAR",
            "SJP",
            "TAUB",
            "VIN",
            "ALL"
        ];

        if (!validPlants.includes(plant)) {

            return res.status(400).json({
                erro: "Planta inválida"
            });

        }

        const user =
            await User.findByIdAndUpdate(
                req.params.id,
                {
                    plant
                },
                {
                    new: true
                }
            );

        if (!user) {

            return res.status(404).json({
                erro: "Usuário não encontrado"
            });

        }

        res.json({
            mensagem: "Planta atualizada",
            user
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.delete("/users/:id", async (req, res) => {

    try {

        const { loggedUsername } = req.body;

        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {

            return res.status(404).json({
                erro: "Usuário não encontrado"
            });

        }

        if (user.username === loggedUsername) {

            return res.status(403).json({
                erro: "Você não pode excluir sua própria conta."
            });

        }

        await User.findByIdAndDelete(
            req.params.id
        );

        res.json({
            mensagem: "Usuário deletado"
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

router.get("/users", async (req, res) => {

    try {

        const users =
            await User.find({
                status: "approved"
            }).select("-password");

        res.json(users);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }

});

export default router;