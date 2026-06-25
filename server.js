import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Printer from "./models/Printer.js";
import printerRoutes from "./routes/printers.js";
import quickLinkRoutes from "./routes/quickLinks.js";
import faviconRoutes from "./routes/favicon.js";
import authRoutes from "./routes/auth.js";
import mapRoutes from "./routes/maps.js";
import uploadRoutes from "./routes/upload.js";
import contractRoutes from "./routes/contracts.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(express.static("public"));

app.use("/api/printers", printerRoutes);
app.use("/api/quicklinks", quickLinkRoutes);
app.use("/api/favicon", faviconRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/maps", mapRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/upload", uploadRoutes);


app.get("/api/test", async (req, res) => {

    const total = await Printer.countDocuments();

    res.json({
        mensagem: "API funcionando",
        mongo: true,
        impressoras: total
    });

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

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});