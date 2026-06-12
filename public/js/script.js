const loggedUser =
    JSON.parse(localStorage.getItem("user"));

    if (!loggedUser) {
    window.location.href = "login.html";
}

const userRole =
    loggedUser.role;

const userPlant =
    loggedUser.plant;

function canEditPlant(plant) {

    if (userRole === "admin") {
        return true;
    }

    return userPlant === plant;

}

const loggedUserName =
    document.getElementById(
        "loggedUserName"
    );

const loggedUserRole =
    document.getElementById(
        "loggedUserRole"
    );

const loggedUserPlant =
    document.getElementById(
        "loggedUserPlant"
    );

loggedUserName.textContent =
    `${loggedUser.username}`;

loggedUserRole.textContent =
    `${loggedUser.role}`;

loggedUserPlant.textContent =
    `${loggedUser.plant}`;

// Seletores principais
const mapWrap = 
    document.getElementById(
        'mapWrap'
    );

const mapUploadInput =
    document.getElementById(
        "mapUploadInput"
    );

const floor = 
    document.getElementById(
        'floor'
    );

const pinsDiv = 
    document.getElementById(
        'pins'
    );

const toggleHelper = 
    document.getElementById(
        'toggleHelper'
    );

const modal = 
    document.getElementById(
        'modal'
    );

const closeModal = 
    document.getElementById(
        'closeModal'
    );

const deletePrinterSidebarBtn = 
    document.getElementById(
        'deletePrinterSidebarBtn'
    );

const searchInput = 
    document.getElementById(
        "search"
    );

const plantSelect = 
    document.getElementById(
        "plantSelect"
    );

const manageMapsBtn =
    document.getElementById(
        "manageMapsBtn"
    );

const mapManagerActions =
    document.getElementById(
        "mapManagerActions"
    );

const addMapBtn = 
    document.getElementById(
        "addMapBtn"
    );

const deleteMapBtn =
    document.getElementById(
        "deleteMapBtn"
    );

const addPageBtn = 
    document.getElementById(
        "addPageBtn"
    );

const deletePageBtn =
    document.getElementById(
        "deletePageBtn"
    );

const prevMapPageBtn =
    document.getElementById(
        "prevMapPageBtn"
    );

const nextMapPageBtn =
    document.getElementById(
        "nextMapPageBtn"
    );

const mapPageNumbers =
    document.getElementById(
        "mapPageNumbers"
    );

const mapPagination =
    document.getElementById(
        "mapPagination"
    );

const isAdmin =
    loggedUser.role === "admin";

if (!isAdmin) {
    manageMapsBtn.style.display = "none";
    mapManagerActions.style.display = "none";
}

manageMapsBtn.addEventListener("click", () => {

    const wasHidden =
        mapManagerActions.classList.contains(
            "hidden"
        );

    closeSidebarModes();

    if (wasHidden) {

        mapManagerActions.classList.remove(
            "hidden"
        );

    }

});

addMapBtn.addEventListener("click", async () => {

    const plantName = 
        prompt("Sigla da nova planta:");

    if(!plantName) {
        return;
    }

    const label = 
        prompt("Nome completo da planta:")

    if (!label) {
        return;
    }

    const response =
        await fetch("/api/maps", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: plantName.toUpperCase(),
                label, 
                pages: []
            })
        });

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.erro ||
                "Erro ao criar planta."
            );

            return;

        }
    
    await loadMaps();

    alert("Planta criada com sucesso!");

});

addPageBtn.addEventListener("click", () => {

    alert(
        "Selecione um arquivo PNG do mapa."
    );

    mapUploadInput.click();

});

mapUploadInput.addEventListener(
    "change",
    async () => {

        const file =
            mapUploadInput.files[0];

        if (!file) {
            return;
        }

        const formData =
            new FormData();

        formData.append(
            "map",
            file
        );

        const response =
            await fetch(
                "/api/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

        const data =
            await response.json();

        console.log(
            "Upload concluído:",
            data
        );

        const map =
            maps.find(
                item => item.name === currentPlant
            );
        
        if (!map) {
            alert("Planta não encontrada.");
            return;
        }

        if (map.pages.includes(data.path)) {

            alert(
                "Está página já está cadastrada."
            );

            return;

        }

        map.pages.push(
            data.path
        );

        await updateMap(
            map._id,
            map
        );

        await loadMaps();

        currentMapPage =
            map.pages.length - 1;

        updatePlantImage();

        renderPins();

        alert("Página adicionada com sucesso!");

    }
);

deletePageBtn.addEventListener("click", async () => {

    const map =
        maps.find(
            item => item.name === currentPlant
        );

    if (!map) {
        alert("Planta não encontrada.");
        return;
    }

    if (map.pages.length <= 1) {

        alert(
            "A planta precisa ter pelo menos uma página."
        );

        return;

    }

    const pagePath =
        map.pages[currentMapPage];

    const confirmDelete =
        confirm(
            `Excluir a página ${currentMapPage + 1}?\n\n${pagePath}`
        );

    if (!confirmDelete) {
        return;
    }

    map.pages.splice(
        currentMapPage,
        1
    );

    await updateMap(
        map._id,
        map
    );

    await loadMaps();

    if (currentMapPage >= map.pages.length) {
        currentMapPage = 
            map.pages.length - 1;
    }

    updatePlantImage();

    renderPins();

    alert("Página exlcuída com sucesso!");

});

deleteMapBtn.addEventListener("click", async () => {

    const map =
        maps.find(
            item => item.name === currentPlant
        );

    if (!map) {
        alert("Planta não encontrada.");
        return;
    }

    const confirmDelete =
        confirm(
            `Deseja realmente excluir a planta ${map.label}?`
        );

    if (!confirmDelete) {
        return;
    }

    const response =
        await fetch(`/api/maps/${map._id}`, {
            method: "DELETE"
        });

    if (!response.ok) {
        alert("Erro ao excluir planta.");
        return;
    }

    await loadMaps();

    currentPlant =
        maps[0]?.name || "";

    plantSelect.value =
        currentPlant;

    currentMapPage = 0;

    updatePlantImage();

    renderPins();

    alert("Planta excluída com sucesso!");

});

let isMultiDeleteMode = false;

function closeAllMenus() {

    mapManagerActions.classList.add(
        "hidden"
    );

    quickLinkForm.classList.add(
        "hidden"
    );

    if (captureMode) {

        captureMode = false;

        toggleHelper.textContent =
            "Adicionar impressoras";

    }

}

function disableCaptureMode() {

    if (!captureMode) {
        return;
    }

    captureMode = false;

    toggleHelper.textContent =
        "Adicionar impressoras";

}

function closeSidebarModes() {

    disableCaptureMode();

    mapManagerActions.classList.add(
        "hidden"
    );

    const confirmBtn =
        document.getElementById(
            "confirmDeleteBtn"
        );

    const cancelBtn =
        document.getElementById(
            "cancelDeleteBtn"
        );

    if (confirmBtn) {
        confirmBtn.remove();
    }

    if (cancelBtn) {
        cancelBtn.remove();
    }

    selectedPins.clear();

    setPinsFloating(false);

    isMultiDeleteMode = false;

    toggleHelper.disabled = false;

    renderPins();

}

function setPinsFloating(active) {
    isMultiDeleteMode = active;

    document.querySelectorAll(".pin-circle.pin-floating").forEach(pin => {
        pin.classList.remove("pin-floating");
    });

    if (active) {
        document.querySelectorAll(".pin-wrapper.selected-pin .pin-circle").forEach(pin => {
            pin.classList.add("pin-floating");
        });
    }
}

function updatePermissionButtons() {

    const plantPrinters = 
        printers.filter(
            printer => printer.plant === currentPlant
    );

    if (canEditPlant(currentPlant) && plantPrinters.length > 0) {
        deletePrinterSidebarBtn.style.display = "block";
    } else {
        deletePrinterSidebarBtn.style.display = "none";
    }

    toggleHelper.style.display =
        canEditPlant(currentPlant) ? "block" : "none";
}

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

function renderMapPagination() {

    const pages =
        getCurrentMapPages();

    if (pages.length <= 1) {

        mapPagination.style.display =
            "none";

        return;

    }

    mapPagination.style.display =
        "flex";

    mapPageNumbers.innerHTML = "";

    pages.forEach((page, index) => {

        const btn =
            document.createElement("button");

        btn.textContent =
            index + 1;

        if (index === currentMapPage) {

            btn.classList.add(
                "active"
            );

        }

        btn.addEventListener(
            "click",
            () => {

                currentMapPage =
                    index;

                selectedPins.clear();

                updatePlantImage();

                renderPins();

            }
        );

        mapPageNumbers.appendChild(
            btn
        );

    });

}

prevMapPageBtn.addEventListener(
    "click",
    () => {

        if (currentMapPage > 0) {

            currentMapPage--;

            selectedPins.clear();

            updatePlantImage();

            renderPins();

        }

    }
);

nextMapPageBtn.addEventListener(
    "click",
    () => {

        const pages =
            getCurrentMapPages();

        if (
            currentMapPage <
            pages.length - 1
        ) {

            currentMapPage++;

            selectedPins.clear();

            updatePlantImage();

            renderPins();

        }

    }
);

function getCurrentMapPages() {

    const map =
        maps.find(
            item => item.name === currentPlant
        );

    if (!map) {
        return [];
    }

    return map.pages;

}

function updatePlantImage() {

    const pages =
        getCurrentMapPages();

    if (!pages.length) {
        
        floor.removeAttribute("src");

        renderMapPagination();

        return;

    }

    floor.src =
        pages[currentMapPage];

    renderMapPagination();

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

let currentPlant =
    userPlant === "ALL"
        ? "SJP"
        : userPlant;

let currentMapPage = 0;

// plantSelect.value =
//     currentPlant;

const currentUser =
    JSON.parse(
        localStorage.getItem("user")
    ).username;

const selectedPins = new Set();

// const plantImages = {
//     ANC: ["img/anc.png"],

//     SCAR: ["img/scar.png"],

//     SJP: ["img/sjp.png"],

//     TAUB: [
//         "img/taub.png",
//         "img/taub2.png"
//     ],

//     VIN: ["img/vin.png"]
// };

let maps = [];

async function updateMap(id, mapData) {

    const response =
        await fetch(`/api/maps/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(mapData)
        });

    return await response.json();

}

async function loadMaps() {

    try {

        const response =
            await fetch("/api/maps");

        maps =
            await response.json();

        plantSelect.innerHTML = "";

        maps.forEach(map => {
            const option = 
                document.createElement(
                    "option"
                );
            option.value = 
                map.name;
            
            option.textContent =
                map.label;

            plantSelect.appendChild(
                option
            );

        });

        plantSelect.value =
            currentPlant;

        if (!maps.some(map => map.name === currentPlant)) {

            currentPlant = 
                maps[0]?.name || "";
            
            plantSelect.value = 
                currentPlant;

        }

        console.log(
            "Mapas carregados:",
            maps
        );

    } catch (error) {

        console.error(
            "Erro ao carregar mapas:",
            error
        );

    }

}

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

async function updatePrinter(id, printerData) {

    try {

        const response = await fetch(`/api/printers/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...printerData,
                userRole,
                userPlant
            })
        });

        return await response.json();

    } catch (error) {

        console.error(
            "Erro ao atualizar impressora:",
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

        if (!response.ok) {
            alert(
                newPrinter.erro ||
                "Erro ao criar impressora."
            );

            return null;
        }

        return newPrinter;

    } catch (error) {

        console.error(
            "Erro ao criar impressora:",
            error
        );

    }
}

async function syncPrinter(printer) {

    console.log("ID Mongo:", printer._id);

    await updatePrinter(
        printer._id,
        printer
    );

    await loadPrinters();
}

async function deletePrinterById(id) {

    try {

        await fetch(`/api/printers/${id}`, {
            method: "DELETE",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                userRole,
                userPlant
            })
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

    console.log("Pesquisando:", searchText);

    renderPins();

});

// searchInput.addEventListener("input", (e) => {

//     searchText = e.target.value.toLowerCase();

//     renderPins();

// });

plantSelect.addEventListener("change", (e) => {

    currentPlant = e.target.value;

    currentMapPage = 0;

    searchText = "";
    searchInput.value = "";

    selectedPins.clear();

    updatePlantImage();

    renderPins();

    updatePermissionButtons();

    console.log(
        "Planta selecionada:",
        currentPlant
    );

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

    const plantPrinters = printers.filter(
        printer => printer.plant === currentPlant
    );

    document.getElementById("printerCounter").textContent =
        `${plantPrinters.length} ${plantPrinters.length === 1 ? 'impressora' : 'impressoras'}`;

    const backups = plantPrinters.filter(
        printer => printer.backup
    ).length;

    document.getElementById("bkpCounter").textContent =
        ` | ${backups} backups ativos`;
        
        updatePermissionButtons();
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

        if (printer.plant !== currentPlant) {
            return false;
        }

        const printerPage =
            printer.page || 1;

        if (printerPage !== currentMapPage + 1) {
            return false;
        }

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

                    ||

                    (printer.col || "")
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

                if (selectedPins.has(index)) {
                    pinWrapper.classList.add("selected-pin");
                    if (isMultiDeleteMode) {
                        circle.classList.add("pin-floating");
                    }
                }

                pinWrapper.appendChild(circle);

                pinWrapper.addEventListener("click", () => {

                console.log("Pin clicado:", printer);

                if (selectMode) {
                    if (selectedPins.has(index)) {
                        selectedPins.delete(index);
                        pinWrapper.classList.remove("selected-pin");
                        circle.classList.remove("pin-floating");
                    } else {
                        selectedPins.add(index);
                        pinWrapper.classList.add("selected-pin");
                        if (isMultiDeleteMode) {
                            circle.classList.add("pin-floating");
                        }
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

    console.log("Printer recebida:", printer);

    currentPrinterIndex = index;
    currentPhotoIndex = 0;

    const canEdit =
    canEditPlant(currentPlant);

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

    mModel.disabled = !canEdit;
    mSerial.disabled = !canEdit;
    mIP.disabled = !canEdit;
    mLoc.disabled = !canEdit;
    mCol.disabled = !canEdit;
    mNotes.disabled = !canEdit;
    mBackup.disabled = !canEdit;

    savePrinterBtn.style.display =
        canEdit ? "block" : "none";

    document.getElementById("deletePrinterBtn").style.display =
        canEdit ? "block" : "none";

    addPhotoBtn.style.display =
        canEdit ? "inline-block" : "none";

    removePhotoBtn.style.display =
        canEdit && printer.photos.length > 0
            ? "inline-block"
            : "none";

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
    plant: currentPlant,
    page: currentMapPage + 1,
    x,
    y,

    userRole,
    userPlant
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
    plant: currentPlant,
    page: currentMapPage + 1,
    x,
    y,

    userRole,
    userPlant
});

await loadPrinters();

});

// Zoom altera pins
panzoomArea.addEventListener('panzoomchange', (e) => adjustPins(e.detail.scale));

// Alternar modo de captura
toggleHelper.addEventListener('click', () => {

    const wasCaptureMode =
        captureMode;

    closeSidebarModes();

    if (wasCaptureMode) {
        return;
    }

    captureMode = true;

    toggleHelper.textContent =
        'Clique no mapa 2x para adicionar';

});

// Excluir impressora individual
async function deletePrinter() {

    if (currentPrinterIndex === null) return;

    const printer = printers[currentPrinterIndex];

    await deletePrinterById(printer._id);

    await loadPrinters();

    modal.style.display = "none";
    currentPrinterIndex = null;
}
document.getElementById("deletePrinterBtn").addEventListener("click", deletePrinter);

// Excluir múltiplas impressoras
function enableMultiDelete() {
    captureMode = false;
    toggleHelper.textContent = 'Adicionar impressoras';
    toggleHelper.disabled = true;

    selectedPins.clear();
    renderPins(true);
    setPinsFloating(true);
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
        if (selectedPins.size === 0) {
            alert("Nenhuma impressora selecionada para exclusão.");
            return;
        }

        const serials = Array.from(selectedPins).map(index => {
            const printer = printers[index];
            return printer.serial || "sem número de série";
        });

        const message = selectedPins.size === 1
            ? `Deseja realmente apagar a impressora com S/N ${serials[0]} do mapa?`
            : `Deseja realmente apagar as impressoras com os seguintes S/N do mapa?\n- ${serials.join("\n- ")}`;

        if (!confirm(message)) {
            return;
        }

        for (const index of selectedPins) {
            const printer = printers[index];
            await deletePrinterById(printer._id);
        }

        selectedPins.clear();
        setPinsFloating(false);
        captureMode = false;
        toggleHelper.textContent = 'Adicionar impressoras';
        toggleHelper.disabled = false;

        await loadPrinters();

        confirmBtn.remove();
        cancelBtn.remove();
    });

    cancelBtn.addEventListener("click", () => {
        selectedPins.clear();
        setPinsFloating(false);
        captureMode = false;
        toggleHelper.textContent = 'Adicionar impressoras';
        toggleHelper.disabled = false;
        renderPins();
        confirmBtn.remove();
        cancelBtn.remove();
    });
}

deletePrinterSidebarBtn.addEventListener(
    "click",
    () => {

        closeSidebarModes();

        enableMultiDelete();

    }
);

const menuBtn = document.getElementById("menuBtn");

const quickLinksSidebar =
    document.getElementById("quickLinksSidebar");

const closeQuickLinks =
    document.getElementById("closeQuickLinks");

menuBtn.addEventListener("click", () => {

    quickLinksSidebar.classList.add("open");

});

closeQuickLinks.addEventListener("click", () => {

    quickLinksSidebar.classList.remove("open");

});

document.addEventListener("click", (e) => {

    const clicouNoBotao =
        menuBtn.contains(e.target);

    const clicouNaSidebar =
        quickLinksSidebar.contains(e.target);

    const clicouNoMapa =
        mapWrap.contains(e.target);

    const clicouNoAdicionar =
        toggleHelper.contains(e.target);

    if (!clicouNoBotao && !clicouNaSidebar) {

        quickLinksSidebar.classList.remove(
            "open"
        );

    }

    if (
        !clicouNoMapa &&
        !clicouNoAdicionar &&
        !clicouNaSidebar
    ) {

        closeAllMenus();
        disableCaptureMode();
    }

});

const addQuickLinkBtn =
    document.getElementById("addQuickLinkBtn");

const quickLinkForm =
    document.getElementById("quickLinkForm");

const quickLinkName =
    document.getElementById("quickLinkName");

const quickLinkUrl =
    document.getElementById("quickLinkUrl");

const saveQuickLinkBtn =
    document.getElementById("saveQuickLinkBtn");

const quickLinksList =
    document.querySelector(".quick-links-list");

let quickLinks = [];

let editingQuickLinkIndex = null;

async function fetchQuickLinks() {
    try {
        const response = await fetch(`/api/quicklinks?user=${currentUser}`);

        quickLinks = await response.json();

        renderQuickLinks();

    } catch (error) {
        console.error("Erro ao carregar atalhos:", error);
    }
}

async function createQuickLinkAPI(data) {
    try {
        await fetch("/api/quicklinks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...data,
                user: currentUser
            })
        });

    } catch (error) {
        console.error("Erro ao criar atalho:", error);
    }
}

async function deleteQuickLinkAPI(id) {

    try {

        await fetch(
            `/api/quicklinks/${id}`,
            {
                method: "DELETE",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    user: currentUser
                })
            }
        );

    } catch (error) {

        console.error(
            "Erro ao excluir atalho:",
            error
        );

    }

}

async function updateQuickLinkAPI(id, data) {

    try {

        await fetch(
            `/api/quicklinks/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    ...data,
                    user: currentUser
                })
            }
        );

    } catch (error) {

        console.error(
            "Erro ao atualizar atalho:",
            error
        );

    }

} 

function saveQuickLinks() {

    console.log(
        "saveQuickLinks será substituída pela API"
    );

}

function renderQuickLinks() {

    quickLinksList.innerHTML = "";

    if (quickLinks.length === 0) {

        quickLinksList.innerHTML = `
            <p class="empty-quick-links">
                Nenhum atalho cadastrado.
                <br>
                Clique em + Adicionar atalho.
            </p>
        `;

        return;
    }

    loadQuickLinks();

}

function createQuickLink(name, url, index) {

    const linkContainer = document.createElement("div");
    linkContainer.className = "quick-link-container";

    const link = document.createElement("a");

    link.href = url;
    link.target = "_blank";
    link.className = "quick-link-item";

    const domain = new URL(url).hostname;

    const faviconUrl =
        `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    link.innerHTML = `
        <img
            src="${faviconUrl}"
            class="quick-link-favicon"
            alt="${name}">

        <span>${name}</span>
    `;

    const pinBtn = document.createElement("button");

    pinBtn.textContent =
        quickLinks[index]?.pinned ? "⭐" : "☆";

    pinBtn.className = "quick-link-pin btn-effect";

    pinBtn.addEventListener("click", async (e) => {

        e.preventDefault();
        e.stopPropagation();

        const quickLink = quickLinks[index];

        await updateQuickLinkAPI(
            quickLink._id,
            {
                ...quickLink,
                pinned: !quickLink.pinned
            }
        );

        await fetchQuickLinks();

    });

    const editBtn = document.createElement("button");

    editBtn.textContent = "✏️";
    editBtn.className = "quick-link-edit btn-effect";

    editBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        editingQuickLinkIndex = index;

        quickLinkName.value = name;
        quickLinkUrl.value = url;

        quickLinkForm.classList.remove("hidden");
    });

    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "🗑";
    deleteBtn.className = "quick-link-delete btn-effect";

    deleteBtn.addEventListener("click", async (e) => {

        e.preventDefault();
        e.stopPropagation();

        const quickLink = quickLinks[index];

        await deleteQuickLinkAPI(
            quickLink._id
        );

        await fetchQuickLinks();

    });

    linkContainer.appendChild(link);
    linkContainer.appendChild(pinBtn);
    linkContainer.appendChild(editBtn);
    linkContainer.appendChild(deleteBtn);

    quickLinksList.appendChild(linkContainer);
}

addQuickLinkBtn.addEventListener("click", () => {

    quickLinkForm.classList.toggle("hidden");

});

function loadQuickLinks() {

    const sortedLinks = [...quickLinks].sort(
        (a, b) => {

            if (a.pinned === b.pinned)
                return 0;

            return a.pinned ? -1 : 1;

        }
    );

    sortedLinks.forEach((link) => {

        const originalIndex =
            quickLinks.indexOf(link);

        createQuickLink(
            link.name,
            link.url,
            originalIndex
        );

    });

}

saveQuickLinkBtn.addEventListener("click", async () => {

    const name = quickLinkName.value.trim();

    let url = quickLinkUrl.value.trim();

    if (!name || !url) {
        alert("Preencha nome e URL.");
        return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }

    if (editingQuickLinkIndex !== null) {

        const quickLink =
            quickLinks[editingQuickLinkIndex];

        await updateQuickLinkAPI(
            quickLink._id,
            {
                ...quickLink,
                name,
                url
            }
        );

        editingQuickLinkIndex = null;

    } else {

        await createQuickLinkAPI({
            name,
            url,
            pinned: false
        });

    }

    await fetchQuickLinks();

    quickLinkName.value = "";

    quickLinkUrl.value = "";

    quickLinkForm.classList.add("hidden");

});

const adminPanelBtn =
    document.getElementById("adminPanelBtn");

if (loggedUser.role !== "admin") {
    adminPanelBtn.style.display = "none";
}

adminPanelBtn.addEventListener("click", () => {
    window.location.href = "admin.html";
});

const logoutBtn =
    document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("user");

    window.location.href =
        "login.html";

});

updatePlantImage();

updatePermissionButtons();

async function startApp() {

    await loadMaps();

    updatePlantImage();

    await loadPrinters();

}

startApp();

// Inicializar atalhos
fetchQuickLinks();

// Gabriel Salton
