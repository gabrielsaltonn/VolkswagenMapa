// Seletores principais
const mapWrap = document.getElementById('mapWrap');
const floor = document.getElementById('floor');
const pinsDiv = document.getElementById('pins');
const toggleHelper = document.getElementById('toggleHelper');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const deletePrinterSidebarBtn = document.getElementById('deletePrinterSidebarBtn');
const searchInput = document.getElementById("search");

// Formulário do modal
const mModel = document.getElementById('mModel');
const mSerial = document.getElementById('mSerial');
const mIP = document.getElementById('mIP');
const mIPLink = document.getElementById('mIPLink');
mIPLink.addEventListener("click", () => {
    const ip = mIP.value.trim();

    if (!ip) return;

    let url = ip;

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "http://" + url;
    }

    window.open(url, "_blank");
});
const mLoc = document.getElementById('mLocal');
const mCol = document.getElementById('mCol');
const mNotes = document.getElementById('mNotes');
const mBackup = document.getElementById('mBckp');
const savePrinterBtn = document.getElementById('salvarImpressora');

function atualizarLinkIP(ip) {

    ip = (ip || "").trim();

    if (ip) {
        mIPLink.style.display = "inline-block";
    } else {
        mIPLink.style.display = "none";
    }
}

// Fotos
const photoPreview = document.getElementById('previewFoto');
const prevPhotoBtn = document.getElementById('fotoAnterior');
const nextPhotoBtn = document.getElementById('proxFoto');
const addPhotoBtn = document.getElementById('addFotoBtn');
const carousel = document.querySelector(".efeitoCarrossel");
const removePhotoBtn = document.getElementById('removerFoto');
const photoInput = document.getElementById('adFoto');
const contadorFotos = document.getElementById("contadorFotos");

addPhotoBtn.addEventListener("click", () => {
    photoInput.click();
});

// Dados
let printers = [];

let searchText = "";

const selectedPins = new Set();

async function loadPrinters() {

    try {

        const response = await fetch("/api/printers");

        printers = await response.json();

        renderPins();

    } catch (error) {

        console.error(
            "Erro ao carregar impressoras:",
            error
        );

    }
}

async function createPrinter(printerData) {

    try {

        const response = await fetch("/api/printers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(printerData)
        });

        const newPrinter = await response.json();

        return newPrinter;

    } catch (error) {

        console.error(
            "Erro ao criar impressora:",
            error
        );

    }
}

async function updatePrinter(id, printerData) {

    try {

        const response = await fetch(`/api/printers/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(printerData)
        });

        return await response.json();

    } catch (error) {

        console.error(
            "Erro ao atualizar impressora:",
            error
        );

    }
}

async function syncPrinter(printer) {

    await updatePrinter(
        printer.id,
        printer
    );

    await loadPrinters();
}

async function deletePrinterById(id) {

    try {

        await fetch(`/api/printers/${id}`, {
            method: "DELETE"
        });

    } catch (error) {

        console.error(
            "Erro ao excluir impressora:",
            error
        );

    }
}

searchInput.addEventListener("input", (e) => {

    searchText = e.target.value.toLowerCase();

    renderPins();

});

let captureMode = false;
let currentPrinterIndex = null;

// 🔒 Impedir que qualquer botão envie toques/cliques para o mapa
document.querySelectorAll("button").forEach(btn => {
    ["touchstart", "touchend", "click"].forEach(ev => {
        btn.addEventListener(ev, e => e.stopPropagation(), { passive: false });
    });
});

// Panzoom
const panzoomArea = document.getElementById('panzoom-area');
const panzoomInstance = Panzoom(panzoomArea, {
    maxScale: 10,
    minScale: 1,
    contain: 'outside'
});
panzoomArea.parentElement.addEventListener('wheel', panzoomInstance.zoomWithWheel);

// Atualizar contadores
function updateCounters() {
    document.getElementById("printerCounter").textContent = 
        `${printers.length} ${printers.length === 1 ? 'impressora' : 'impressoras'}`;
    const backups = printers.filter(p => p.backup).length;
    document.getElementById("bkpCounter").textContent = ` | ${backups} backups ativos`;
}

function atualizarContadorFotos() {

    const printer = printers[currentPrinterIndex];

    if (!printer || !printer.photos || printer.photos.length === 0) {
        contadorFotos.style.display = "none";
        return;
    }

    contadorFotos.style.display = "block";

    contadorFotos.textContent =
        `Foto ${currentPhotoIndex + 1} de ${printer.photos.length}`;
}

// Ajustar tamanho dos pins conforme o zoom
function adjustPins(scale) {
    const minSize = 1;
    const maxSize = 20;
    const zoomMax = panzoomInstance.getOptions().maxScale;
    const zoomMin = panzoomInstance.getOptions().minScale;

    const size = Math.max(minSize, maxSize - ((scale - zoomMin) / (zoomMax - zoomMin)) * (maxSize - minSize));

    document.querySelectorAll(".pin-circle").forEach(pin => {
        pin.style.width = `${size}px`;
        pin.style.height = `${size}px`;

        if (size <= 1.5) {
            pin.style.border = "none";
            pin.style.boxShadow = "none";
        } else {
            pin.style.border = "1px solid white";
            pin.style.boxShadow = "0 0 3px rgba(0,0,0,0.45)";
        }
    });
}

// Renderizar pins
function renderPins(selectMode = false) {

    pinsDiv.innerHTML = "";

    printers
        .map((printer, realIndex) => ({
            printer,
            realIndex
        }))
        .filter(item => {

            const printer = item.printer;

            if (!searchText) return true;

            return (
                (printer.model || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                (printer.serial || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                (printer.loc || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                (printer.ip || "")
                    .toLowerCase()
                    .includes(searchText)
            );

        })
        .forEach(item => {

            const printer = item.printer;
            const index = item.realIndex;

            const pinWrapper = document.createElement("div");
            pinWrapper.className = "pin-wrapper";
            pinWrapper.style.left = `${printer.x}%`;
            pinWrapper.style.top = `${printer.y}%`;

            const circle = document.createElement("div");
            circle.className = "pin-circle";
            circle.style.background = printer.backup ? "green" : "red";

            pinWrapper.appendChild(circle);

            pinWrapper.addEventListener("click", () => {

            console.log("Pin clicado:", printer);

            if (selectMode) {
                if (selectedPins.has(index)) {
                    selectedPins.delete(index);
                    pinWrapper.classList.remove("selected-pin");
                } else {
                    selectedPins.add(index);
                    pinWrapper.classList.add("selected-pin");
                }
            } else {
                showModal(printer, index);
            }
        });

        pinsDiv.appendChild(pinWrapper);
    });

    updateCounters();
    adjustPins(panzoomInstance.getScale());
}

// Mostrar modal
function showModal(printer, index) {

    currentPrinterIndex = index;
    currentPhotoIndex = 0;

    if (!printer.photos) {
        printer.photos = [];
    }

    if (printer.photos.length > 0) {

        carousel.style.display = "inline-block";
        removePhotoBtn.style.display = "inline-block";

        prevPhotoBtn.style.display =
            printer.photos.length > 1 ? "block" : "none";

        nextPhotoBtn.style.display =
            printer.photos.length > 1 ? "block" : "none";

        photoPreview.src = printer.photos[0];
        atualizarContadorFotos();

    } else {

        carousel.style.display = "none";
        removePhotoBtn.style.display = "none";

    }

    mModel.value = printer.model;
    mSerial.value = printer.serial;
    mIP.value = printer.ip || "";
    mLoc.value = printer.loc || "";
    mCol.value = printer.col || "";
    mNotes.value = printer.notes || "";
    mBackup.checked = printer.backup;

    atualizarLinkIP(printer.ip);
    modal.style.display = "flex";
}

// Navegação de fotos
prevPhotoBtn.addEventListener("click", () => {

    const printer = printers[currentPrinterIndex];

    if (!printer.photos) return;

    currentPhotoIndex =
        (currentPhotoIndex - 1 + printer.photos.length) %
        printer.photos.length;

    photoPreview.src =
        printer.photos[currentPhotoIndex];

    atualizarContadorFotos();
});

nextPhotoBtn.addEventListener("click", () => {

    const printer = printers[currentPrinterIndex];

    if (!printer.photos) return;

    currentPhotoIndex =
        (currentPhotoIndex + 1) %
        printer.photos.length;

    photoPreview.src =
        printer.photos[currentPhotoIndex];

    atualizarContadorFotos();
});

// Adicionar foto
photoInput.addEventListener("change", (e) => {

    const files = [...e.target.files];

    if (files.length === 0) return;

    const printer = printers[currentPrinterIndex];

    if (!printer.photos) {
        printer.photos = [];
    }

    let loaded = 0;

    files.forEach(file => {

        const reader = new FileReader();

        reader.onload = async () => {

            printer.photos.push(reader.result);

            loaded++;

            if (loaded === files.length) {

                carousel.style.display = "inline-block";
                removePhotoBtn.style.display = "inline-block";

                prevPhotoBtn.style.display =
                    printer.photos.length > 1 ? "block" : "none";

                nextPhotoBtn.style.display =
                    printer.photos.length > 1 ? "block" : "none";

                currentPhotoIndex = printer.photos.length - 1;

                photoPreview.src =
                    printer.photos[currentPhotoIndex];

                atualizarContadorFotos();

                await syncPrinter(printer);
            }
        };

        reader.readAsDataURL(file);

    });

    photoInput.value = "";
});

// Remover foto
removePhotoBtn.addEventListener("click", async () => {

    const printer = printers[currentPrinterIndex];

    if (!printer.photos || printer.photos.length === 0)
        return;

    printer.photos.splice(currentPhotoIndex, 1);

    if (printer.photos.length === 0) {

        carousel.style.display = "none";
        removePhotoBtn.style.display = "none";

    } else {

        currentPhotoIndex = Math.min(
            currentPhotoIndex,
            printer.photos.length - 1
        );

        photoPreview.src = printer.photos[currentPhotoIndex];
        atualizarContadorFotos();

        prevPhotoBtn.style.display =
            printer.photos.length > 1 ? "block" : "none";

        nextPhotoBtn.style.display =
            printer.photos.length > 1 ? "block" : "none";
    }
    atualizarContadorFotos();
    await syncPrinter(printer);
});

// Salvar impressora
savePrinterBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const printer = printers[currentPrinterIndex];
    printer.model = mModel.value;
    printer.serial = mSerial.value;
    printer.ip = mIP.value;
    printer.loc = mLoc.value;
    printer.col = mCol.value;
    printer.notes = mNotes.value;
    printer.backup = mBackup.checked;

    await syncPrinter(printer);

modal.style.display = "none";
});

// Fechar modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    currentPrinterIndex = null;
});
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        currentPrinterIndex = null;
    }
});

// --- Double Tap para Touch ---
let lastTap = 0;

panzoomArea.addEventListener("touchend", async (e) => { 
    const currentTime = Date.now();
    const tapLength = currentTime - lastTap;

    if (tapLength < 300 && tapLength > 0) {
        if (!captureMode) return;

        const touch = e.changedTouches[0];
        const rect = panzoomArea.getBoundingClientRect();

        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;

        await createPrinter({
    model: "",
    serial: "",
    ip: "",
    loc: "",
    col: "",
    notes: "",
    backup: false,
    photos: [],
    x,
    y
});

await loadPrinters();

    }

    lastTap = currentTime;

});

// Double-click mouse
panzoomArea.addEventListener('dblclick', async (e) => {
    if (!captureMode) return;
    const rect = panzoomArea.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    await createPrinter({
    model: "",
    serial: "",
    ip: "",
    loc: "",
    col: "",
    notes: "",
    backup: false,
    photos: [],
    x,
    y
});

await loadPrinters();

});

// Zoom altera pins
panzoomArea.addEventListener('panzoomchange', (e) => adjustPins(e.detail.scale));

// Alternar modo de captura
toggleHelper.addEventListener('click', () => {
    captureMode = !captureMode;
    toggleHelper.textContent = captureMode ?
        'Clique no mapa 2x para adicionar' :
        'Adicionar impressoras';
});

// Excluir impressora individual
async function deletePrinter() {

    if (currentPrinterIndex === null) return;

    const printer = printers[currentPrinterIndex];

    await deletePrinterById(printer.id);

    await loadPrinters();

    modal.style.display = "none";
    currentPrinterIndex = null;
}
document.getElementById("deletePrinterBtn").addEventListener("click", deletePrinter);

// Excluir múltiplas impressoras
function enableMultiDelete() {
    selectedPins.clear();
    renderPins(true);
    const sidebar = document.querySelector(".sidebar-buttons");
    if (document.getElementById("confirmDeleteBtn")) return;

    const confirmBtn = document.createElement("button");
    confirmBtn.id = "confirmDeleteBtn";
    confirmBtn.textContent = "Confirmar exclusão";
    confirmBtn.style.background = "red";
    confirmBtn.style.color = "white";
    confirmBtn.style.marginTop = "10px";
    sidebar.appendChild(confirmBtn);

    const cancelBtn = document.createElement("button");
    cancelBtn.id = "cancelDeleteBtn";
    cancelBtn.textContent = "Cancelar exclusão";
    cancelBtn.style.background = "red";
    cancelBtn.style.color = "white";
    cancelBtn.style.marginTop = "5px";
    sidebar.appendChild(cancelBtn);

    confirmBtn.addEventListener("click", async () => {

    for (const index of selectedPins) {

        const printer = printers[index];

        await deletePrinterById(
            printer.id
        );
    }

    selectedPins.clear();

    await loadPrinters();

    confirmBtn.remove();
    cancelBtn.remove();
});

    cancelBtn.addEventListener("click", () => {
        selectedPins.clear();
        renderPins();
        confirmBtn.remove();
        cancelBtn.remove();
    });
}
document.getElementById("deletePrinterSidebarBtn").addEventListener("click", enableMultiDelete);

// Inicializar pins
loadPrinters();

// Gabriel Salton
