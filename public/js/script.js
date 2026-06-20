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

const mapAdminModal =
    document.getElementById(
        "mapAdminModal"
    );

const closeMapAdminModal =
    document.getElementById(
        "closeMapAdminModal"
    );

const mapsAdminList =
    document.getElementById(
        "mapsAdminList"
    );

const newPlantBtn =
    document.getElementById(
        "newPlantBtn"
    );

const mapPagesModal =
    document.getElementById(
        "mapPagesModal"
    );

const closeMapPagesModal =
    document.getElementById(
        "closeMapPagesModal"
    );

const mapPagesTitle =
    document.getElementById(
        "mapPagesTitle"
    );

const pagesAdminList =
    document.getElementById(
        "pagesAdminList"
    );

const addPageModalBtn =
    document.getElementById(
        "addPageModalBtn"
    );

const isAdmin =
    loggedUser.role === "admin";

if (!isAdmin) {
    manageMapsBtn.style.display = "none";
}

manageMapsBtn.addEventListener("click", () => {

    renderMapAdmin();

    mapAdminModal.style.display =
        "flex";

});

const addPageConfirmModal =
    document.getElementById(
        "addPageConfirmModal"
    );

const closeAddPageConfirmModal =
    document.getElementById(
        "closeAddPageConfirmModal"
    );

const cancelAddPageBtn =
    document.getElementById(
        "cancelAddPageBtn"
    );

const confirmAddPageBtn =
    document.getElementById(
        "confirmAddPageBtn"
    );

const deleteMapModal =
    document.getElementById(
        "deleteMapModal"
    );

const deleteMapText =
    document.getElementById(
        "deleteMapText"
    );

const closeDeleteMapModal =
    document.getElementById(
        "closeDeleteMapModal"
    );

const cancelDeleteMapBtn =
    document.getElementById(
        "cancelDeleteMapBtn"
    );

const confirmDeleteMapBtn =
    document.getElementById(
        "confirmDeleteMapBtn"
    );

const editMapModal =
    document.getElementById(
        "editMapModal"
    );

const closeEditMapModal =
    document.getElementById(
        "closeEditMapModal"
    );

const cancelEditMapBtn =
    document.getElementById(
        "cancelEditMapBtn"
    );

const confirmEditMapBtn =
    document.getElementById(
        "confirmEditMapBtn"
    );

const editMapInput =
    document.getElementById(
        "editMapInput"
    );

const appMessageModal =
    document.getElementById(
        "appMessageModal"
    );

const appMessageTitle =
    document.getElementById(
        "appMessageTitle"
    );

const appMessageText =
    document.getElementById(
        "appMessageText"
    );

const closeAppMessageModal =
    document.getElementById(
        "closeAppMessageModal"
    );

const cancelAppMessageBtn =
    document.getElementById(
        "cancelAppMessageBtn"
    );

const confirmAppMessageBtn =
    document.getElementById(
        "confirmAppMessageBtn"
    );

const newPlantModal =
    document.getElementById(
        "newPlantModal"
    );

const closeNewPlantModal =
    document.getElementById(
        "closeNewPlantModal"
    );

const cancelNewPlantBtn =
    document.getElementById(
        "cancelNewPlantBtn"
    );

const confirmNewPlantBtn =
    document.getElementById(
        "confirmNewPlantBtn"
    );

const newPlantNameInput =
    document.getElementById(
        "newPlantNameInput"
    );

const newPlantLabelInput =
    document.getElementById(
        "newPlantLabelInput"
    );

confirmDeleteMapBtn.addEventListener(
    "click",
    async () => {

        if (!mapToDelete) {
            return;
        }

        await fetch(
            `/api/maps/${mapToDelete._id}`,
            {
                method: "DELETE"
            }
        );

        deleteMapModal.style.display =
            "none";

        mapToDelete = null;

        await loadMaps();

        renderMapAdmin();

    }
);

closeDeleteMapModal.addEventListener(
    "click",
    () => {

        deleteMapModal.style.display =
            "none";

    }
);

cancelDeleteMapBtn.addEventListener(
    "click",
    () => {

        deleteMapModal.style.display =
            "none";

    }
);

deleteMapModal.addEventListener(
    "click",
    (e) => {

        if (e.target === deleteMapModal) {

            deleteMapModal.style.display =
                "none";

        }

    }
);

newPlantBtn.addEventListener(
    "click",
    () => {

        newPlantNameInput.value =
            "";

        newPlantLabelInput.value =
            "";

        newPlantModal.style.display =
            "flex";

    }
);

closeNewPlantModal.addEventListener(
    "click",
    () => {

        newPlantModal.style.display =
            "none";

    }
);

cancelNewPlantBtn.addEventListener(
    "click",
    () => {

        newPlantModal.style.display =
            "none";

    }
);

newPlantModal.addEventListener(
    "click",
    (e) => {

        if (e.target === newPlantModal) {

            newPlantModal.style.display =
                "none";

        }

    }
);

confirmNewPlantBtn.addEventListener(
    "click",
    async () => {

        const plantName =
            newPlantNameInput.value
                .trim()
                .toUpperCase();

        const label =
            newPlantLabelInput.value
                .trim();

        if (!plantName || !label) {

            showMessageModal(
                "Campos obrigatórios",
                "Preencha a sigla e o nome completo da planta."
            );

            return;

        }

        const response =
            await fetch(
                "/api/maps",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        name: plantName,
                        label,
                        pages: []
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            showMessageModal(
                "Erro",
                data.erro ||
                "Erro ao criar planta."
            );

            return;

        }

        newPlantModal.style.display =
            "none";

        await loadMaps();

        renderMapAdmin();

        showMessageModal(
            "Sucesso",
            "Planta criada com sucesso!"
        );

    }
);

closeMapPagesModal.addEventListener(
    "click",
    () => {

        mapPagesModal.style.display =
            "none";

        renderMapAdmin();

        mapAdminModal.style.display =
            "flex";

    }
);

addPageModalBtn.addEventListener(
    "click",
    () => {

        addPageConfirmModal.style.display =
            "flex";

    }
);

closeAddPageConfirmModal.addEventListener(
    "click",
    () => {

        addPageConfirmModal.style.display =
            "none";

    }
);

cancelAddPageBtn.addEventListener(
    "click",
    () => {

        addPageConfirmModal.style.display =
            "none";

    }
);

confirmAddPageBtn.addEventListener(
    "click",
    () => {

        addPageConfirmModal.style.display =
            "none";

        mapUploadInput.click();

    }
);

addPageConfirmModal.addEventListener(
    "click",
    (e) => {

        if (
            e.target ===
            addPageConfirmModal
        ) {

            addPageConfirmModal.style.display =
                "none";

        }

    }
);

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

        const map = selectedMapAdmin || maps.find(
            item => item.name === currentPlant
        );
        
        if (!map) {
            showMessageModal(
                "Planta não encontrada",
                "Não foi possível encontrar a planta selecionada."
            );
            return;
        }

        if (map.pages.includes(data.path)) {

           showMessageModal(
                "Página já cadastrada",
                "Esta página já está cadastrada nesta planta."
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

        await loadMaps();

        const updatedMap =
            maps.find(
                m => m._id === map._id
            );

        if (updatedMap) {

            renderMapPages(
                updatedMap
            );

        }

        showMessageModal(
            "Mapa adicionado",
            "A nova página foi adicionada com sucesso."
        );

    }
);

let isMultiDeleteMode = false;

function closeAllMenus() {

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

    const confirmBtn =
        document.getElementById(
            "confirmDeleteBtn"
        );

    if (confirmBtn) {
        confirmBtn.remove();
    }

    selectedPins.clear();

    setPinsFloating(false);

    isMultiDeleteMode = false;

    renderPins();

    deletePrinterSidebarBtn.textContent =
        "Excluir Impressoras";

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

const savePrinterMessage =
    document.getElementById(
        "savePrinterMessage"
    );

let savePrinterMessageTimer = null;

function showSavePrinterMessage(
    message,
    isError = false
) {

    clearTimeout(
        savePrinterMessageTimer
    );

    savePrinterMessage.textContent =
        message;

    savePrinterMessage.classList.toggle(
        "error",
        isError
    );

    savePrinterMessage.classList.add(
        "visible"
    );

    savePrinterMessageTimer =
        setTimeout(() => {

            savePrinterMessage.classList.remove(
                "visible"
            );

        }, 1800);

}

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

        btn.classList.add("btn-effect");

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

        const pages =
            getCurrentMapPages();

        currentMapPage =
            (currentMapPage - 1 + pages.length)
            % pages.length;

        selectedPins.clear();

        updatePlantImage();

        renderPins();

    }
);

nextMapPageBtn.addEventListener(
    "click",
    () => {

        const pages =
            getCurrentMapPages();

        currentMapPage =
            (currentMapPage + 1)
            % pages.length;

        selectedPins.clear();

        updatePlantImage();

        renderPins();

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

const currentUser =
    JSON.parse(
        localStorage.getItem("user")
    ).username;

const selectedPins = new Set();

let maps = [];

let selectedMapAdmin = null;

let mapToDelete = null;

let mapToEdit = null;

let appMessageCallback =
    null;

closeEditMapModal.addEventListener(
    "click",
    () => {

        editMapModal.style.display =
            "none";

    }
);

cancelEditMapBtn.addEventListener(
    "click",
    () => {

        editMapModal.style.display =
            "none";

    }
);

editMapModal.addEventListener(
    "click",
    (e) => {

        if (e.target === editMapModal) {

            editMapModal.style.display =
                "none";

        }

    }
);

confirmEditMapBtn.addEventListener(
    "click",
    async () => {

        if (!mapToEdit) {
            return;
        }

        const newLabel =
            editMapInput.value.trim();

        if (!newLabel) {
            return;
        }

        mapToEdit.label =
            newLabel;

        await updateMap(
            mapToEdit._id,
            mapToEdit
        );

        editMapModal.style.display =
            "none";

        mapToEdit = null;

        await loadMaps();

        renderMapAdmin();

    }
);

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

function renderMapAdmin() {

    mapsAdminList.innerHTML = "";

    maps.forEach(map => {

        const div =
            document.createElement("div");

        div.className =
            "map-admin-item";

        div.innerHTML = `
            <div class="map-admin-info">

                <strong>
                    ${map.name}
                </strong>

                <div>
                    ${map.label}
                </div>

                <small>
                    ${map.pages.length}
                    mapa(s)
                </small>

            </div>

            <div class="map-admin-actions">

                <button class="edit-map-btn">
                    ✏️
                </button>

                <button class="pages-map-btn">
                    📄
                </button>

                <button class="delete-map-btn">
                    🗑️
                </button>

            </div>
        `;

        div.querySelector(".edit-map-btn").addEventListener(
            "click",
            async () => {

                mapTpEdit = map;
            
                editMapInput.value =
                    map.label;
                
                editMapModal.style.display = 
                    "flex";

            }
        );

        div.querySelector(".delete-map-btn").addEventListener(
            "click",
            async () => {

                mapToDelete = map;

                deleteMapText.innerHTML = `
                    Deseja realmente excluir
                    <strong>${map.label}</strong>
                    <br><br>
                    Todas as páginas desta planta serão removidas.
                `;

                deleteMapModal.style.display =
                    "flex";

            }
        );

        div.querySelector(".pages-map-btn").addEventListener(
            "click",
            () => {

                mapAdminModal.style.display =
                    "none";

                renderMapPages(map);

            }
        );

        mapsAdminList.appendChild(div);

    });

}

function renderMapPages(map) {

    selectedMapAdmin = map;

    mapPagesTitle.textContent =
        map.label;

    pagesAdminList.innerHTML = "";

    map.pages.forEach((page, index) => {

        const div =
            document.createElement("div");

        div.className =
            "map-admin-item";

        div.innerHTML = `
            <div>
                Página ${index + 1}
                <br>
                <small>${page.split("/").pop()}</small>
            </div>

            <button class="delete-page-btn">
                🗑️
            </button>
        `;

        div.querySelector(
            ".delete-page-btn"
        ).addEventListener(
            "click",
            () => {

                showMessageModal(
                    "Excluir página",
                    `Deseja realmente excluir a Página ${index + 1}?`,
                    async () => {

                        const response =
                            await fetch(
                                `/api/maps/${map._id}/pages/${index}`,
                                {
                                    method: "DELETE"
                                }
                            );

                        const data =
                            await response.json();

                        if (!response.ok) {

                            showMessageModal(
                                "Erro",
                                data.erro ||
                                "Erro ao excluir página."
                            );

                            return;

                        }

                        await loadMaps();

                        const updatedMap =
                            maps.find(
                                m => m._id === map._id
                            );

                        if (updatedMap) {

                            renderMapPages(
                                updatedMap
                            );

                        }

                    },
                    true
                );

            }
        );

        pagesAdminList.appendChild(div);

    });

    mapPagesModal.style.display =
        "flex";

}

function showMessageModal(
    title,
    message,
    callback = null,
    showCancel = false
) {

    appMessageTitle.textContent =
        title;

    appMessageText.innerHTML =
        message;

    appMessageCallback =
        callback;

    cancelAppMessageBtn.style.display =
        showCancel
            ? "inline-block"
            : "none";

    appMessageModal.style.display =
        "flex";

}

closeAppMessageModal.addEventListener(
    "click",
    () => {

        appMessageModal.style.display =
            "none";

    }
);

cancelAppMessageBtn.addEventListener(
    "click",
    () => {

        appMessageModal.style.display =
            "none";

    }
);

appMessageModal.addEventListener(
    "click",
    (e) => {

        if (
            e.target === appMessageModal
        ) {

            appMessageModal.style.display =
                "none";

        }

    }
);

confirmAppMessageBtn.addEventListener(
    "click",
    async () => {

        appMessageModal.style.display =
            "none";

        if (appMessageCallback) {

            const callback =
                appMessageCallback;

            appMessageCallback =
                null;

            await callback();

        }

    }
);

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

            showMessageModal(
                "Erro",
                "Não foi possível criar a impressora."
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

        const response =
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

        if (!response.ok) {

            console.error(
                "Erro ao excluir impressora:",
                response.status
            );

            return false;

        }

        return true;

    } catch (error) {

        console.error(
            "Erro ao excluir impressora:",
            error
        );

        return false;

    }

}

searchInput.addEventListener("input", (e) => {

    searchText = e.target.value.toLowerCase();

    console.log("Pesquisando:", searchText);

    renderPins();

});

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

// Impedir que qualquer botão envie toques/cliques para o mapa
document.querySelectorAll("button").forEach(btn => {

    if (btn.id === "menuBtn") {
        return;
    }

    ["touchstart", "touchend", "click"].forEach(ev => {

        btn.addEventListener(
            ev,
            e => e.stopPropagation(),
            { passive: false }
        );

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

function getMapPositionFromClientPoint(clientX, clientY) {

    const rect =
        floor.getBoundingClientRect();

    const x =
        ((clientX - rect.left) / rect.width) * 100;

    const y =
        ((clientY - rect.top) / rect.height) * 100;

    return {
        x: Math.min(100, Math.max(0, x)),
        y: Math.min(100, Math.max(0, y))
    };

}

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

    savePrinterMessage.textContent =
    "";

    savePrinterMessage.classList.remove(
        "visible",
        "error"
    );

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

    const printer =
        printers[currentPrinterIndex];

    printer.model =
        mModel.value;

    printer.serial =
        mSerial.value;

    printer.ip =
        mIP.value.trim();

    printer.loc =
        mLoc.value;

    printer.col =
        mCol.value;

    printer.notes =
        mNotes.value;

    printer.backup =
        mBackup.checked;

    try {

        await syncPrinter(
            printer
        );

        atualizarLinkIP(
            printer.ip
        );

        showSavePrinterMessage(
            "Dados salvos"
        );

    } catch (error) {

        console.error(
            "Erro ao salvar impressora:",
            error
        );

        showSavePrinterMessage(
            "Erro ao salvar",
            true
        );

    }

});

// Fechar modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    currentPrinterIndex = null;
});

closeMapAdminModal.addEventListener(
    "click",
    () => {

        mapAdminModal.style.display =
            "none";

    }
);

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        currentPrinterIndex = null;
    }
});

window.addEventListener("click", (e) => {

    if (e.target === mapAdminModal) {

        mapAdminModal.style.display =
            "none";

    }

    if (e.target === mapPagesModal) {

        mapPagesModal.style.display =
            "none";

        if (selectedMapAdmin) {

            renderMapAdmin();

            mapAdminModal.style.display =
                "flex";

        }

    }

});

// --- Double Tap para Touch ---
// --- Double Tap seguro para Touch ---
let lastTapTime = 0;
let lastTapX = 0;
let lastTapY = 0;

let touchStartX = 0;
let touchStartY = 0;
let touchMoved = false;

let isCreatingPrinter = false;

const TAP_MAX_MOVE = 12;
const DOUBLE_TAP_DELAY = 300;
const DOUBLE_TAP_DISTANCE = 32;

panzoomArea.addEventListener(
    "touchstart",
    (e) => {

        if (!captureMode) {
            return;
        }

        if (e.touches.length !== 1) {
            touchMoved = true;
            return;
        }

        const touch =
            e.touches[0];

        touchStartX =
            touch.clientX;

        touchStartY =
            touch.clientY;

        touchMoved =
            false;

    },
    { passive: true }
);

panzoomArea.addEventListener(
    "touchmove",
    (e) => {

        if (!captureMode) {
            return;
        }

        if (e.touches.length !== 1) {
            touchMoved = true;
            return;
        }

        const touch =
            e.touches[0];

        const moveX =
            Math.abs(
                touch.clientX - touchStartX
            );

        const moveY =
            Math.abs(
                touch.clientY - touchStartY
            );

        if (
            moveX > TAP_MAX_MOVE ||
            moveY > TAP_MAX_MOVE
        ) {

            touchMoved =
                true;

        }

    },
    { passive: true }
);

panzoomArea.addEventListener(
    "touchend",
    async (e) => {

        if (!captureMode) {
            return;
        }

        if (touchMoved) {
            return;
        }

        if (e.changedTouches.length !== 1) {
            return;
        }

        const touch =
            e.changedTouches[0];

        const currentTime =
            Date.now();

        const timeSinceLastTap =
            currentTime - lastTapTime;

        const distanceFromLastTap =
            Math.hypot(
                touch.clientX - lastTapX,
                touch.clientY - lastTapY
            );

        const isDoubleTap =
            timeSinceLastTap < DOUBLE_TAP_DELAY &&
            distanceFromLastTap < DOUBLE_TAP_DISTANCE;

        if (!isDoubleTap) {

            lastTapTime =
                currentTime;

            lastTapX =
                touch.clientX;

            lastTapY =
                touch.clientY;

            return;

        }

        e.preventDefault();
        e.stopPropagation();

        lastTapTime =
            0;

        if (isCreatingPrinter) {
            return;
        }

        isCreatingPrinter =
            true;

        try {

            const { x, y } =
                getMapPositionFromClientPoint(
                    touch.clientX,
                    touch.clientY
                );

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

        } finally {

            isCreatingPrinter =
                false;

        }

    },
    { passive: false }
);

// Double-click mouse
panzoomArea.addEventListener('dblclick', async (e) => {
    if (!captureMode) return;

    const { x, y } =
        getMapPositionFromClientPoint(
            e.clientX,
            e.clientY
        );

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

    selectedPins.clear();
    renderPins(true);
    setPinsFloating(true);
    const sidebar = document.querySelector(".sidebar-buttons");
    if (document.getElementById("confirmDeleteBtn")) return;

    const confirmBtn = document.createElement("button");
    confirmBtn.id = "confirmDeleteBtn";

    confirmBtn.textContent = "Confirmar exclusão";

    const divider =
    document.querySelector(
        ".sidebar-divider"
    );

    confirmBtn.classList.add(
        "danger-btn",
        "btn-effect"
    );

    sidebar.insertBefore(
        confirmBtn,
        divider
    );

    confirmBtn.addEventListener("click", async (e) => {

        e.stopPropagation();

        if (selectedPins.size === 0) {

            showMessageModal(
                "Nenhuma impressora selecionada",
                "Selecione pelo menos uma impressora para excluir."
            );

            return;

        }

        const pinsToDelete =
            [...selectedPins];

        const serials =
            pinsToDelete.map(index => {

                const printer =
                    printers[index];

                return printer.serial ||
                    "sem número de série";

            });

        const message =
            pinsToDelete.length === 1
                ? `Deseja realmente apagar a impressora com S/N ${serials[0]} do mapa?`
                : `Deseja realmente apagar as impressoras com os seguintes S/N do mapa?<br>- ${serials.join("<br>- ")}`;

        showMessageModal(
            "Confirmar exclusão",
            message,
            async () => {

                for (const index of pinsToDelete) {

                    const printer =
                        printers[index];

                    if (!printer) {
                        continue;
                    }

                    await deletePrinterById(
                        printer._id
                    );

                }

                selectedPins.clear();

                isMultiDeleteMode = false;

                setPinsFloating(false);

                captureMode = false;

                toggleHelper.textContent =
                    "Adicionar impressoras";

                await loadPrinters();

                confirmBtn.remove();

                deletePrinterSidebarBtn.textContent =
                    "Excluir Impressoras";

            },
            true
        );

    });

}

deletePrinterSidebarBtn.addEventListener(
    "click",
    () => {

        if (isMultiDeleteMode) {

            closeSidebarModes();

            deletePrinterSidebarBtn.textContent =
                "Excluir Impressoras";

            return;

        }

        closeSidebarModes();

        enableMultiDelete();

        deletePrinterSidebarBtn.textContent =
            "Cancelar Exclusão";

    }
);

const menuBtn = document.getElementById("menuBtn");

const quickLinksSidebar =
    document.getElementById("quickLinksSidebar");

const closeQuickLinks =
    document.getElementById("closeQuickLinks");

const collapsedSidebar =
    document.getElementById(
        "collapsedSidebar"
    );

const collapsedLogoBtn =
    document.getElementById(
        "collapsedLogoBtn"
    );

const collapsedQuickLinksList =
    document.getElementById(
        "collapsedQuickLinksList"
    );

const collapsedAddQuickLinkBtn =
    document.getElementById(
        "collapsedAddQuickLinkBtn"
    );

const collapsedUsersBtn =
    document.getElementById(
        "collapsedUsersBtn"
    );

const collapsedLogoutBtn =
    document.getElementById(
        "collapsedLogoutBtn"
    );

function openQuickLinksSidebar() {

    quickLinksSidebar.classList.add(
        "open"
    );

    document.body.classList.add(
        "quick-sidebar-open"
    );

}

function closeQuickLinksSidebar() {

    quickLinksSidebar.classList.remove(
        "open"
    );

    document.body.classList.remove(
        "quick-sidebar-open"
    );

}

collapsedLogoBtn.addEventListener(
    "click",
    () => {

        openQuickLinksSidebar();

    }
);

closeQuickLinks.addEventListener(
    "click",
    () => {

        closeQuickLinksSidebar();

    }
);

function handleMenuButtonOpen(e) {

    e.preventDefault();
    e.stopPropagation();

    openQuickLinksSidebar();

}

menuBtn.addEventListener(
    "click",
    handleMenuButtonOpen
);

menuBtn.addEventListener(
    "touchend",
    handleMenuButtonOpen,
    { passive: false }
);

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

        closeQuickLinksSidebar(

        );

    }

    if (
        !clicouNoMapa &&
        !clicouNoAdicionar &&
        !clicouNaSidebar
    ) {

        closeAllMenus();

        closeSidebarModes();
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

    quickLinksList.innerHTML =
        "";

    collapsedQuickLinksList.innerHTML =
        "";

    renderCollapsedQuickLinks();

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

function renderCollapsedQuickLinks() {

    const sortedLinks =
        [...quickLinks].sort(
            (a, b) => {

                if (a.pinned === b.pinned) {
                    return 0;
                }

                return a.pinned ? -1 : 1;

            }
        );

    sortedLinks.forEach(link => {

        const item =
            document.createElement("a");

        item.href =
            link.url;

        item.target =
            "_blank";

        item.className =
            "collapsed-sidebar-btn collapsed-link-btn";

        item.title =
            link.name;

        item.dataset.label = 
            link.name;

        const domain =
            new URL(link.url).hostname;

        const faviconUrl =
            `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

        item.innerHTML =
            `
                <img
                    src="${faviconUrl}"
                    alt="${link.name}">
            `;

        collapsedQuickLinksList.appendChild(
            item
        );

    });

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

collapsedAddQuickLinkBtn.addEventListener(
    "click",
    (e) => {

        e.stopPropagation();

        openQuickLinksSidebar();

        quickLinkForm.classList.remove(
            "hidden"
        );

        quickLinkName.focus();

    }
);

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

        showMessageModal(
            "Campos obrigatórios",
            "Preencha o nome e a URL do atalho."
        );

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

if (loggedUser.role === "admin") {

    adminPanelBtn.textContent =
        "Gerenciar Usuários";

    adminPanelBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "admin.html";

        }
    );

} else {

    adminPanelBtn.textContent =
        "Usuários";

    adminPanelBtn.style.display =
        "block";

    adminPanelBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "users.html";

        }
    );

}

collapsedUsersBtn.addEventListener(
    "click",
    () => {

        if (loggedUser.role === "admin") {

            window.location.href =
                "admin.html";

        } else {

            window.location.href =
                "users.html";

        }

    }
);

const logoutBtn =
    document.getElementById("logoutBtn");

function logoutUser() {

    localStorage.removeItem(
        "user"
    );

    window.location.href =
        "login.html";

}

function confirmLogout() {

    showMessageModal(
        "Sair do sistema",
        "Deseja realmente sair?",
        () => {

            logoutUser();

        },
        true
    );

}

logoutBtn.addEventListener(
    "click",
    confirmLogout
);

collapsedLogoutBtn.addEventListener(
    "click",
    confirmLogout
);

function confirmLogout() {

    showMessageModal(
        "Sair do sistema",
        "Deseja realmente sair?",
        () => {

            logoutUser();

        },
        true
    );

}

logoutBtn.addEventListener(
    "click",
    confirmLogout
);

collapsedLogoutBtn.addEventListener(
    "click",
    confirmLogout
);

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
