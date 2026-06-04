import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Printer from "./models/Printer.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/api/test", async (req, res) => {

    const total = await Printer.countDocuments();

    res.json({
        mensagem: "API funcionando",
        mongo: true,
        impressoras: total
    });

});

app.get("/api/printers", async (req, res) => {

    const printers = await Printer.find();

    res.json(printers);

});

app.post("/api/printers", async (req, res) => {

    const printer = await Printer.create(req.body);

    res.status(201).json(printer);
});

app.delete("/api/printers/:id", async (req, res) => {

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

app.put("/api/printers/:id", async (req, res) => {

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

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Conectado ao MongoDB");
    })
    .catch((error) => {
        console.error(
            "Erro ao conectar-se ao MongoDB:", 
            error
        );
    });

app.listen(8081, () => {
    console.log("Server is running on port 8081");
});