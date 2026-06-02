import express from "express";
import fs from "fs/promises";

async function loadPrinters() {

    const data = await fs.readFile(
        "./printers.json",
        "utf-8"
    );

    return JSON.parse(data);
}

async function savePrinters(printers) {

    await fs.writeFile(
        "./printers.json",
        JSON.stringify(
            printers,
            null,
            2
        )
    );
}

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/api/test", (req, res) => {
    res.json({ mensagem: "API funcionando" });
});

app.get("/api/printers", async (req, res) => {

    const printers = await loadPrinters();

    res.json(printers);

});

app.post("/api/printers", async (req, res) => {

    const printers = await loadPrinters();

    const nextId = printers.length > 0 ? Math.max(...printers.map(p => p.id)) + 1 : 1;

    const printer = {
        id: nextId,
        ...req.body
    };

    printers.push(printer);

    await savePrinters(printers);

    res.status(201).json(printer);
});

app.delete("/api/printers/:id", async (req, res) => {

    const id = Number(req.params.id);

    let printers = await loadPrinters();

    printers = printers.filter(
        printer => printer.id !== id
    );

    await savePrinters(printers);

    res.status(204).send();

});

app.put("/api/printers/:id", async (req, res) => {

    const id = Number(req.params.id);

    const printers = await loadPrinters();

    const index = printers.findIndex(
        p => p.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            erro: "Impressora não encontrada"
        });
    }

    printers[index] = {
        ...printers[index],
        ...req.body,
        id
    };

    await savePrinters(printers);

    res.json(printers[index]);
});


app.listen(8081, () => {
    console.log("Server is running on port 8081");
});