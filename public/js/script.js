const loggedUser =
    JSON.parse(localStorage.getItem("user"));

if (!loggedUser) {
    window.location.href = "login.html";
}

let userRole =
    loggedUser.role;

let userPlant =
    loggedUser.plant;

const DEFAULT_CONTRACT_NUMBER =
    "1234";

function getInitialActiveContractNumber() {

    const storedContract =
        localStorage.getItem(
            "activeContractNumber"
        );

    if (storedContract) {
        return storedContract;
    }

    const firstAccessContract =
        loggedUser.access?.[0]?.contractNumber;

    return firstAccessContract ||
        DEFAULT_CONTRACT_NUMBER;

}

let activeContractNumber =
    getInitialActiveContractNumber();

localStorage.setItem(
    "activeContractNumber",
    activeContractNumber
);

function getContractQueryParams() {

    const params =
        new URLSearchParams({
            contractNumber: activeContractNumber,
            loggedUsername: loggedUser.username
        });

    return params.toString();

}

const SUPER_ADMIN_USERS = [
    "admin@simpress.com.br",
    "admin.dev@simpress.com.br"
];

function normalizeUsername(username) {

    return String(username || "")
        .trim()
        .toLowerCase();

}

function isSuperAdminUser() {

    return SUPER_ADMIN_USERS.includes(
        normalizeUsername(loggedUser.username)
    );

}

function isGestorUser() {

    return loggedUser.role === "gestor";

}

function getActiveUserAccess() {

    const accessList =
        loggedUser.access || [];

    return accessList.find(accessItem =>
        accessItem.contractNumber === activeContractNumber
    );

}

function getActiveUserPlants() {

    if (
        isSuperAdminUser() ||
        isGestorUser()
    ) {
        return ["ALL"];
    }

    const activeAccess =
        getActiveUserAccess();

    return activeAccess?.plants?.length
        ? activeAccess.plants
        : [loggedUser.plant || "SJP"];

}

function getActiveUserRole() {

    if (
        isSuperAdminUser() ||
        isGestorUser()
    ) {
        return "admin";
    }

    const activeAccess =
        getActiveUserAccess();

    return activeAccess?.role ||
        loggedUser.role ||
        "user";

}

function syncActiveUserPermissions() {

    const plants =
        getActiveUserPlants();

    userRole =
        getActiveUserRole();

    userPlant =
        plants.includes("ALL")
            ? "ALL"
            : plants[0];

}

function canManageCurrentContract() {

    if (
        isSuperAdminUser() ||
        isGestorUser()
    ) {
        return true;
    }

    const activeAccess =
        getActiveUserAccess();

    return (
        activeAccess?.role === "admin" ||
        activeAccess?.role === "gestor"
    );

}

function canEditPlant(plant) {

    if (
        isSuperAdminUser() ||
        isGestorUser()
    ) {
        return true;
    }

    const activeAccess =
        getActiveUserAccess();

    if (!activeAccess) {
        return false;
    }

    if (
        activeAccess.role !== "admin" &&
        activeAccess.role !== "gestor"
    ) {
        return false;
    }

    const plants =
        activeAccess.plants || [];

    return (
        plants.includes("ALL") ||
        plants.includes(plant)
    );

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

const contractSelect =
    document.getElementById(
        "contractSelect"
    );

function renderLoggedUserAccessInfo() {

    loggedUserName.textContent =
        `${loggedUser.username}`;

    loggedUserRole.textContent =
        `${userRole}`;

    loggedUserPlant.textContent =
        `${userPlant}`;

}

syncActiveUserPermissions();

renderLoggedUserAccessInfo();

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

function updateMapAdminVisibility() {

    manageMapsBtn.style.display =
        canManageCurrentContract()
            ? "block"
            : "none";

}

updateMapAdminVisibility();

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
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    loggedUsername: loggedUser.username
                })
            }
        );

        const deletedCurrentPlant =
            mapToDelete.name === currentPlant;

        deleteMapModal.style.display =
            "none";

        mapToDelete = null;

        if (deletedCurrentPlant) {
            currentMapPage = 0;
        }

        await refreshMapsAndView();

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
                        pages: [],
                        contractNumber: activeContractNumber,
                        loggedUsername: loggedUser.username
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

        await refreshMapsAndView();

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

        const updatedPageIndex =
            map.pages.length - 1;

        if (map.name === currentPlant) {
            currentMapPage = updatedPageIndex;
        }

        await refreshMapsAndView({
            renderAdmin: false,
            pagesMapId: map._id,
            keepPagesModal: true
        });

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

const mMacAddress =
    document.getElementById("mMacAddress");

const mPrintQueue =
    document.getElementById("mPrintQueue");

const mLoc = 
    document.getElementById('mLocal');

const mCol = 
    document.getElementById('mCol');

const mCostCenter =
    document.getElementById("mCostCenter");

const mNotes = 
    document.getElementById('mNotes');

const mBackup = 
    document.getElementById('mBckp');

const mIPLink = 
    document.getElementById('mIPLink');

mIPLink.addEventListener("click", () => {
    const ip = mIP.value.trim();

    if (!ip) return;

    let url = ip;

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "http://" + url;
    }

    window.open(url, "_blank");
});

const savePrinterBtn = 
    document.getElementById('salvarImpressora');

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
const photoPreview = 
    document.getElementById('previewFoto');

const prevPhotoBtn = 
    document.getElementById('fotoAnterior');
const nextPhotoBtn = 
    document.getElementById('proxFoto');

const addPhotoBtn = 
    document.getElementById('addFotoBtn');

const takePhotoBtn = 
    document.getElementById('tirarFotoBtn');

const carousel =
    document.querySelector(".efeitoCarrossel");

const removePhotoBtn = 
    document.getElementById('removerFoto');

const photoInput = 
    document.getElementById('adFoto');

const cameraInput = 
    document.getElementById('cameraFoto');

const contadorFotos = 
    document.getElementById("contadorFotos");

const photoMenuBtn =
    document.getElementById("photoMenuBtn");

const photoMenu =
    document.getElementById("photoMenu");

const viewPhotoBtn =
    document.getElementById("viewPhotoBtn");

const deletePhotoMenuBtn =
    document.getElementById("deletePhotoMenuBtn");

const photoViewerModal =
    document.getElementById("photoViewerModal");

const photoViewerImage =
    document.getElementById("photoViewerImage");

const closePhotoViewerBtn =
    document.getElementById("closePhotoViewerBtn");

const MAX_PHOTOS_PER_PRINTER = 4;
const MAX_PHOTO_WIDTH = 900;
const MAX_PHOTO_HEIGHT = 900;
const PHOTO_QUALITY = 0.6;

takePhotoBtn.addEventListener("click", () => {
    cameraInput.click();
});

addPhotoBtn.addEventListener("click", () => {
    photoInput.click();
});

photoMenuBtn.addEventListener("click", (e) => {

    e.preventDefault();
    e.stopPropagation();

    photoMenu.classList.toggle("hidden");

});

viewPhotoBtn.addEventListener("click", () => {

    const printer =
        printers[currentPrinterIndex];

    if (
        !printer ||
        !printer.photos ||
        printer.photos.length === 0
    ) {
        return;
    }

    const photo =
        printer.photos[currentPhotoIndex];

    photoViewerImage.src =
        photo;

    photoViewerModal.style.display =
        "flex";

    photoMenu.classList.add("hidden");

});

function closePhotoViewer() {

    photoViewerModal.style.display =
        "none";

    photoViewerImage.removeAttribute(
        "src"
    );

}

closePhotoViewerBtn.addEventListener(
    "click",
    closePhotoViewer
);

photoViewerModal.addEventListener(
    "click",
    (e) => {

        if (e.target === photoViewerModal) {
            closePhotoViewer();
        }

    }
);

deletePhotoMenuBtn.addEventListener("click", () => {

    photoMenu.classList.add("hidden");

    removePhotoBtn.click();

});

document.addEventListener("click", () => {

    photoMenu.classList.add("hidden");

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

let expandedPinClusterId = null;

const PIN_CLUSTER_RADIUS_PERCENT = 1;
const PIN_TINY_SIZE = 1;

const MOBILE_MAP_QUERY =
    "(max-width: 768px)";

const PIN_MAX_SIZE_DESKTOP = 30;
const PIN_MAX_SIZE_MOBILE = 18;

const CLUSTER_MAX_SIZE_DESKTOP = 30;
const CLUSTER_MAX_SIZE_MOBILE = 24;

const EXPANDED_CLUSTER_GAP_DESKTOP_PX = 34;
const EXPANDED_CLUSTER_GAP_MOBILE_PX = 24;

function isMobileMapView() {

    return window.matchMedia(
        MOBILE_MAP_QUERY
    ).matches;

}

function getPinMaxSize(pin) {

    const isCluster =
        pin.classList.contains(
            "pin-cluster-circle"
        );

    if (isMobileMapView()) {

        return isCluster
            ? CLUSTER_MAX_SIZE_MOBILE
            : PIN_MAX_SIZE_MOBILE;

    }

    return isCluster
        ? CLUSTER_MAX_SIZE_DESKTOP
        : PIN_MAX_SIZE_DESKTOP;

}

function getExpandedClusterSpreadPercent() {

    const mapWidth =
        mapWrap.getBoundingClientRect().width || 320;

    const gapPx =
        isMobileMapView()
            ? EXPANDED_CLUSTER_GAP_MOBILE_PX
            : EXPANDED_CLUSTER_GAP_DESKTOP_PX;

    return (gapPx / mapWidth) * 100;

}

const CLUSTER_FULL_ZOOM = 7.2;
const CLUSTER_DETAIL_ZOOM = 9.2;

function getClusterTransition(scale) {

    const progress =
        (scale - CLUSTER_FULL_ZOOM) /
        (CLUSTER_DETAIL_ZOOM - CLUSTER_FULL_ZOOM);

    return Math.min(
        1,
        Math.max(0, progress)
    );

}

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

        await refreshMapsAndView();

    }
);

async function updateMap(id, mapData) {

    const response =
        await fetch(`/api/maps/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...mapData,
                contractNumber:
                    mapData.contractNumber ||
                    activeContractNumber,
                loggedUsername:
                    loggedUser.username
            })
        });

    return await response.json();

}

async function loadContracts() {

    try {

        const contractParams =
            new URLSearchParams({
                loggedUsername:
                    loggedUser.username
            });

        const response =
            await fetch(
                `/api/contracts?${contractParams.toString()}`
            );

        const contracts =
            await response.json();

        if (!response.ok) {

            console.error(
                contracts.erro ||
                "Erro ao carregar contratos."
            );

            return;

        }

        const userContractNumbers =
            loggedUser.access?.map(item =>
                item.contractNumber
            ) || [];

        const availableContracts =
            (
                isSuperAdminUser() ||
                isGestorUser()
            )
                ? contracts
                : contracts.filter(contract =>
                    userContractNumbers.includes(
                        contract.number
                    )
                );

        contractSelect.innerHTML = "";

        availableContracts.forEach(contract => {

            const option =
                document.createElement("option");

            option.value =
                contract.number;

            option.textContent =
                `${contract.name} - ${contract.number}`;

            contractSelect.appendChild(option);

        });

        if (
            !availableContracts.some(contract =>
                contract.number === activeContractNumber
            )
        ) {

            activeContractNumber =
                availableContracts[0]?.number ||
                DEFAULT_CONTRACT_NUMBER;

            localStorage.setItem(
                "activeContractNumber",
                activeContractNumber
            );

        }

        contractSelect.value =
            activeContractNumber;

    } catch (error) {

        console.error(
            "Erro ao carregar contratos:",
            error
        );

    }

}

contractSelect.addEventListener(
    "change",
    async (e) => {

        activeContractNumber =
            e.target.value;

        localStorage.setItem(
            "activeContractNumber",
            activeContractNumber
        );

        syncActiveUserPermissions();

        renderLoggedUserAccessInfo();

        updateMapAdminVisibility();

        if (typeof updateAdminPanelButton === "function") {
            updateAdminPanelButton();
        }

        currentMapPage = 0;

        searchText = "";
        searchInput.value = "";

        selectedPins.clear();

        expandedPinClusterId =
            null;

        await refreshMapsAndView();

        await loadPrinters();

    }
);

async function loadMaps() {

    try {

        const response =
            await fetch(
                `/api/maps?${getContractQueryParams()}`
            );

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

async function refreshMapsAndView({
    renderAdmin = true,
    pagesMapId = null,
    keepPagesModal = false
} = {}) {

    await loadMaps();

    const pages =
        getCurrentMapPages();

    if (
        currentMapPage >= pages.length
    ) {

        currentMapPage =
            Math.max(
                0,
                pages.length - 1
            );

    }

    if (!pages.length) {
        currentMapPage = 0;
    }

    selectedPins.clear();

    if (
        typeof expandedPinClusterId !== "undefined"
    ) {
        expandedPinClusterId = null;
    }

    updatePlantImage();

    renderPins();

    updatePermissionButtons();

    if (renderAdmin) {
        renderMapAdmin();
    }

    if (
        keepPagesModal &&
        pagesMapId
    ) {

        const updatedMap =
            maps.find(
                map => map._id === pagesMapId
            );

        if (updatedMap) {
            renderMapPages(updatedMap);
        }

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

                mapToEdit = map;
            
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
                                    method: "DELETE",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        loggedUsername: loggedUser.username
                                    })
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

                        await refreshMapsAndView({
                            renderAdmin: false,
                            pagesMapId: map._id,
                            keepPagesModal: true
                        });

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

        const response = 
            await fetch(
                `/api/printers?${getContractQueryParams()}`
        );

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
                contractNumber:
                    printerData.contractNumber ||
                    activeContractNumber,
                loggedUsername:
                    loggedUser.username,
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
            body: JSON.stringify({
                ...printerData,
                contractNumber:
                    printerData.contractNumber ||
                    activeContractNumber,
                loggedUsername:
                    loggedUser.username
            })

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
                    loggedUsername:
                        loggedUser.username,
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

    searchText =
        e.target.value;

    expandedPinClusterId =
        null;

    console.log(
        "Pesquisando:",
        searchText
    );
    
    renderPins();

});

plantSelect.addEventListener("change", (e) => {

    currentPlant = e.target.value;

    currentMapPage = 0;

    searchText = "";
    searchInput.value = "";

    expandedPinClusterId = null;

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

    const minSize =
        PIN_TINY_SIZE;

    const zoomMax =
        panzoomInstance.getOptions().maxScale;

    const zoomMin =
        panzoomInstance.getOptions().minScale;

    const zoomProgress =
        (scale - zoomMin) /
        (zoomMax - zoomMin);

    document.querySelectorAll(".pin-circle").forEach(pin => {

        const isClusterDetailDot =
            Boolean(
                pin.closest(".cluster-detail-pin")
            );

        const maxSize =
            getPinMaxSize(pin);

        const baseSize =
            Math.max(
                minSize,
                maxSize -
                    zoomProgress *
                    (maxSize - minSize)
            );

        const finalSize =
            isClusterDetailDot
                ? PIN_TINY_SIZE
                : baseSize;

        const isTiny =
            isClusterDetailDot ||
            finalSize <= PIN_TINY_SIZE;

        const pinSize =
            `${finalSize}px`;

        pin.style.setProperty(
            "width",
            pinSize,
            "important"
        );

        pin.style.setProperty(
            "height",
            pinSize,
            "important"
        );

        pin.style.setProperty(
            "min-width",
            pinSize,
            "important"
        );

        pin.style.setProperty(
            "min-height",
            pinSize,
            "important"
        );

        pin.style.setProperty(
            "max-width",
            pinSize,
            "important"
        );

        pin.style.setProperty(
            "max-height",
            pinSize,
            "important"
        );

        pin.style.setProperty(
            "padding",
            "0",
            "important"
        );

        pin.style.setProperty(
            "box-sizing",
            "border-box",
            "important"
        );

        pin.style.setProperty(
            "aspect-ratio",
            "1 / 1",
            "important"
        );

        pin.classList.toggle(
            "pin-tiny",
            isTiny
        );

        if (
            pin.classList.contains("pin-cluster-circle")
        ) {

            if (!pin.dataset.clusterCount) {
                pin.dataset.clusterCount =
                    pin.textContent;
            }

            pin.textContent =
                isTiny
                    ? ""
                    : pin.dataset.clusterCount;

            pin.style.fontSize =
                isTiny
                    ? "0px"
                    : "11px";

        }

        if (pin.dataset.photoUrl) {

            if (isTiny) {

                pin.style.backgroundImage =
                    "none";

                pin.style.background =
                    "red";

            } else {

                pin.style.backgroundImage =
                    `url("${pin.dataset.photoUrl}")`;

            }

        }

        if (isTiny) {

            pin.style.border =
                "none";

            pin.style.boxShadow =
                "none";

            pin.style.outline =
                "none";

            pin.style.padding =
                "0";

            pin.style.lineHeight =
                "0";

            pin.style.fontSize =
                "0";

        } else {

            pin.style.border =
                "1px solid white";

            pin.style.boxShadow =
                "0 0 3px rgba(0,0,0,0.45)";

            pin.style.outline =
                "";

        }

    });

}

function clampPinPosition(value) {

    return Math.min(
        99.5,
        Math.max(0.5, value)
    );

}

function normalizeSearchValue(value) {

    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");

}

function printerMatchesCurrentView(printer) {

    if (printer.plant !== currentPlant) {
        return false;
    }

    const printerPage =
        printer.page || 1;

    if (printerPage !== currentMapPage + 1) {
        return false;
    }

    if (!searchText) {
        return true;
    }

    const backupText =
        printer.backup
            ? "backup bkp reserva"
            : "";

    const normalizedSearch =
        normalizeSearchValue(searchText);

    if (!normalizedSearch) {
        return true;
    }

    const normalizedPrinterData =
        normalizeSearchValue([
            printer.model,
            printer.serial,
            printer.loc,
            printer.ip,
            printer.macAddress,
            printer.printQueue,
            printer.col,
            printer.costCenter,
            printer.notes,
            backupText
        ].join(" "));

    return normalizedPrinterData.includes(
        normalizedSearch
    );

}

function getPinDistance(printerA, printerB) {

    return Math.hypot(
        Number(printerA.x) - Number(printerB.x),
        Number(printerA.y) - Number(printerB.y)
    );

}

function buildPinClusters(items) {

    const clusters = [];

    items.forEach(item => {

        const cluster =
            clusters.find(existingCluster =>
                existingCluster.items.some(existingItem =>
                    getPinDistance(
                        item.printer,
                        existingItem.printer
                    ) <= PIN_CLUSTER_RADIUS_PERCENT
                )
            );

        if (cluster) {

            cluster.items.push(item);

        } else {

            clusters.push({
                items: [item]
            });

        }

    });

    return clusters.map(cluster => {

        const sortedItems =
            [...cluster.items].sort(
                (a, b) => a.realIndex - b.realIndex
            );

        const centerX =
            sortedItems.reduce(
                (sum, item) => sum + Number(item.printer.x),
                0
            ) / sortedItems.length;

        const centerY =
            sortedItems.reduce(
                (sum, item) => sum + Number(item.printer.y),
                0
            ) / sortedItems.length;

        return {
            id: sortedItems
                .map(item => item.realIndex)
                .join("-"),
            items: sortedItems,
            x: centerX,
            y: centerY
        };

    });

}

function createPinCircle(printer) {

    const circle =
        document.createElement("div");

    circle.className =
        "pin-circle";

    const hasPhoto =
        printer.photos &&
        printer.photos.length > 0;

    if (printer.backup) {

        circle.style.background =
            "green";

    } else if (hasPhoto) {

        circle.classList.add(
            "pin-has-photo"
        );

        circle.style.backgroundImage =
            `url("${printer.photos[0]}")`;

        circle.dataset.photoUrl =
            printer.photos[0];

    } else {

        circle.style.background =
            "red";

    }

    return circle;

}

function renderSinglePin(
    item,
    selectMode = false,
    position = null,
    extraClass = ""
) {

    const printer =
        item.printer;

    const index =
        item.realIndex;

    const pinWrapper =
        document.createElement("div");

    pinWrapper.className =
        "pin-wrapper";

    if (captureMode) {

        pinWrapper.classList.add(
            "pin-capture-disabled"
        );

    }

    if (extraClass) {

        pinWrapper.classList.add(
            extraClass
        );

    }

    pinWrapper.style.left =
        `${position ? position.x : printer.x}%`;

    pinWrapper.style.top =
        `${position ? position.y : printer.y}%`;

    const circle =
        createPinCircle(printer);

    if (selectedPins.has(index)) {

        pinWrapper.classList.add(
            "selected-pin"
        );

        if (isMultiDeleteMode) {

            circle.classList.add(
                "pin-floating"
            );

        }

    }

    pinWrapper.appendChild(circle);

    pinWrapper.addEventListener("click", (e) => {

        e.stopPropagation();

        console.log(
            "Pin clicado:",
            printer
        );

        if (selectMode) {

            if (selectedPins.has(index)) {

                selectedPins.delete(index);

                pinWrapper.classList.remove(
                    "selected-pin"
                );

                circle.classList.remove(
                    "pin-floating"
                );

            } else {

                selectedPins.add(index);

                pinWrapper.classList.add(
                    "selected-pin"
                );

                if (isMultiDeleteMode) {

                    circle.classList.add(
                        "pin-floating"
                    );

                }

            }

        } else {

            showModal(
                printer,
                index
            );

        }

    });

    pinsDiv.appendChild(
        pinWrapper
    );

    return pinWrapper;

}

function renderClusterPin(
    cluster,
    opacity = 1,
    isInteractive = true
) {

    const pinWrapper =
        document.createElement("div");

    pinWrapper.className =
        "pin-wrapper pin-cluster-wrapper";

    pinWrapper.style.left =
        `${cluster.x}%`;

    pinWrapper.style.top =
        `${cluster.y}%`;

    pinWrapper.style.opacity =
        opacity;

    if (!isInteractive) {

        pinWrapper.classList.add(
            "pin-cluster-disabled"
        );

    }

    const circle =
        document.createElement("div");

    circle.className =
        "pin-circle pin-cluster-circle";

    circle.textContent =
        cluster.items.length;

    circle.dataset.clusterCount =
        cluster.items.length;

    pinWrapper.appendChild(
        circle
    );

    if (isInteractive) {

        pinWrapper.addEventListener("click", (e) => {

            e.stopPropagation();

            expandedPinClusterId =
                expandedPinClusterId === cluster.id
                    ? null
                    : cluster.id;

            renderPins();

        });

    }

    pinsDiv.appendChild(
        pinWrapper
    );

}

function renderClusterDetailPins(
    cluster,
    opacity,
    isInteractive
) {

    cluster.items.forEach(item => {

        const pinWrapper =
            renderSinglePin(
                item,
                false,
                null,
                "cluster-detail-pin"
            );

        pinWrapper.style.opacity =
            opacity;

        if (!isInteractive) {

            pinWrapper.classList.add(
                "cluster-detail-disabled"
            );

        }

    });

}

function renderExpandedCluster(cluster) {

    const total =
        cluster.items.length;

    const spreadPercent =
        getExpandedClusterSpreadPercent();

    cluster.items.forEach((item, groupIndex) => {

        const offset =
            (groupIndex - ((total - 1) / 2))
            * spreadPercent;

        renderSinglePin(
            item,
            false,
            {
                x: clampPinPosition(
                    cluster.x + offset
                ),
                y: clampPinPosition(
                    cluster.y
                )
            },
            "expanded-cluster-pin"
        );

    });

}

// Renderizar pins
function renderPins(selectMode = false) {

    pinsDiv.innerHTML = "";

    const visibleItems =
        printers
            .map((printer, realIndex) => ({
                printer,
                realIndex
            }))
            .filter(item =>
                printerMatchesCurrentView(
                    item.printer
                )
            );

    if (selectMode || isMultiDeleteMode || captureMode) {

        visibleItems.forEach(item => {

            renderSinglePin(
                item,
                selectMode || isMultiDeleteMode
            );

        });

    } else {

        const scale =
            panzoomInstance.getScale();

        const clusterProgress =
            getClusterTransition(scale);

        const isDetailMode =
            clusterProgress >= 1;

        const clusters =
            buildPinClusters(
                visibleItems
            );

        clusters.forEach(cluster => {

            if (cluster.items.length === 1) {

                renderSinglePin(
                    cluster.items[0],
                    false
                );

                return;

            }

            if (
                expandedPinClusterId === cluster.id &&
                !isDetailMode
            ) {

                renderExpandedCluster(
                    cluster
                );

                return;

            }

            if (clusterProgress > 0) {

                renderClusterDetailPins(
                    cluster,
                    clusterProgress,
                    isDetailMode
                );

            }

            if (!isDetailMode) {

                renderClusterPin(
                    cluster,
                    1 - clusterProgress,
                    true
                );

            }

        });

    }

    updateCounters();

    adjustPins(
        panzoomInstance.getScale()
    );

}

// Fechar grupo somente em clique real, não ao arrastar o mapa
let clusterCloseStartX = 0;
let clusterCloseStartY = 0;
let clusterCloseMoved = false;

const CLUSTER_CLOSE_MAX_MOVE = 8;

document.addEventListener(
    "pointerdown",
    (e) => {

        if (!expandedPinClusterId) {
            return;
        }

        clusterCloseStartX =
            e.clientX;

        clusterCloseStartY =
            e.clientY;

        clusterCloseMoved =
            false;

    }
);

document.addEventListener(
    "pointermove",
    (e) => {

        if (!expandedPinClusterId) {
            return;
        }

        const moveX =
            Math.abs(
                e.clientX - clusterCloseStartX
            );

        const moveY =
            Math.abs(
                e.clientY - clusterCloseStartY
            );

        if (
            moveX > CLUSTER_CLOSE_MAX_MOVE ||
            moveY > CLUSTER_CLOSE_MAX_MOVE
        ) {

            clusterCloseMoved =
                true;

        }

    }
);

document.addEventListener(
    "click",
    (e) => {

        if (!expandedPinClusterId) {
            return;
        }

        if (clusterCloseMoved) {

            clusterCloseMoved =
                false;

            return;

        }

        if (
            e.target.closest(".pin-wrapper")
        ) {
            return;
        }

        expandedPinClusterId =
            null;

        renderPins();

    }
);

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

        prevPhotoBtn.style.display =
            printer.photos.length > 1 ? "block" : "none";

        nextPhotoBtn.style.display =
            printer.photos.length > 1 ? "block" : "none";

        photoPreview.src = printer.photos[0];
        atualizarContadorFotos();

    } else {

        carousel.style.display = "none";

    }

    mModel.value = printer.model || "";
    mSerial.value = printer.serial || "";
    mIP.value = printer.ip || "";

    mMacAddress.value =
        printer.macAddress || "";

    mPrintQueue.value =
        printer.printQueue || "";

    mLoc.value = printer.loc || "";
    mCol.value = printer.col || "";

    mCostCenter.value =
        printer.costCenter || "";

    mNotes.value = printer.notes || "";
    mBackup.checked = printer.backup;

    mModel.disabled = !canEdit;
    mSerial.disabled = !canEdit;
    mIP.disabled = !canEdit;
    mMacAddress.disabled = !canEdit;
    mPrintQueue.disabled = !canEdit;
    mLoc.disabled = !canEdit;
    mCol.disabled = !canEdit;
    mCostCenter.disabled = !canEdit;
    mNotes.disabled = !canEdit;
    mBackup.disabled = !canEdit;

    savePrinterBtn.style.display =
        canEdit ? "block" : "none";

    document.getElementById("deletePrinterBtn").style.display =
        canEdit ? "block" : "none";

    addPhotoBtn.style.display =
        canEdit ? "inline-block" : "none";

    atualizarLinkIP(printer.ip);
    modal.style.display = "flex";
}

let isPhotoAnimating = false;

function animatePhotoChange(newIndex, direction) {

    if (isPhotoAnimating) {
        return;
    }

    const printer =
        printers[currentPrinterIndex];

    if (
        !printer ||
        !printer.photos ||
        !printer.photos[newIndex]
    ) {
        return;
    }

    isPhotoAnimating =
        true;

    const outClass =
        direction === "next"
            ? "photo-out-left"
            : "photo-out-right";

    const inClass =
        direction === "next"
            ? "photo-in-right"
            : "photo-in-left";

    photoPreview.classList.remove(
        "photo-out-left",
        "photo-out-right",
        "photo-in-left",
        "photo-in-right"
    );

    photoPreview.classList.add(
        outClass
    );

    setTimeout(() => {

        currentPhotoIndex =
            newIndex;

        photoPreview.src =
            printer.photos[currentPhotoIndex];

        photoPreview.classList.remove(
            outClass
        );

        photoPreview.classList.add(
            inClass
        );

        atualizarContadorFotos();

        setTimeout(() => {

            photoPreview.classList.remove(
                inClass
            );

            isPhotoAnimating =
                false;

        }, 220);

    }, 160);

}

// Navegação de fotos
function showPreviousPhoto() {

    const printer =
        printers[currentPrinterIndex];

    if (
        !printer ||
        !printer.photos ||
        printer.photos.length <= 1
    ) {
        return;
    }

    const newIndex =
        (currentPhotoIndex - 1 + printer.photos.length) %
        printer.photos.length;

    animatePhotoChange(
        newIndex,
        "prev"
    );

}

function showNextPhoto() {

    const printer =
        printers[currentPrinterIndex];

    if (
        !printer ||
        !printer.photos ||
        printer.photos.length <= 1
    ) {
        return;
    }

    const newIndex =
        (currentPhotoIndex + 1) %
        printer.photos.length;

    animatePhotoChange(
        newIndex,
        "next"
    );

}

prevPhotoBtn.addEventListener(
    "click",
    showPreviousPhoto
);

nextPhotoBtn.addEventListener(
    "click",
    showNextPhoto
);

// Swipe / arraste real das fotos no mobile
let photoSwipeStartX = 0;
let photoSwipeStartY = 0;
let photoSwipeDeltaX = 0;
let photoSwipeActive = false;
let photoSwipeDragging = false;

const PHOTO_SWIPE_MIN_DISTANCE = 55;

function resetPhotoDragStyle() {

    photoPreview.classList.remove(
        "photo-dragging"
    );

    photoPreview.style.transform =
        "";

    photoPreview.style.opacity =
        "";

}

function changePhotoAfterDrag(direction) {

    const printer =
        printers[currentPrinterIndex];

    if (
        !printer ||
        !printer.photos ||
        printer.photos.length <= 1
    ) {
        resetPhotoDragStyle();
        return;
    }

    if (isPhotoAnimating) {
        resetPhotoDragStyle();
        return;
    }

    isPhotoAnimating =
        true;

    const isNext =
        direction === "next";

    const newIndex =
        isNext
            ? (currentPhotoIndex + 1) % printer.photos.length
            : (currentPhotoIndex - 1 + printer.photos.length) % printer.photos.length;

    const exitX =
        isNext
            ? "-110%"
            : "110%";

    const enterX =
        isNext
            ? "110%"
            : "-110%";

    photoPreview.classList.remove(
        "photo-dragging"
    );

    photoPreview.style.transition =
        "transform 0.16s ease, opacity 0.16s ease";

    photoPreview.style.transform =
        `translateX(${exitX})`;

    photoPreview.style.opacity =
        "0";

    setTimeout(() => {

        currentPhotoIndex =
            newIndex;

        photoPreview.src =
            printer.photos[currentPhotoIndex];

        photoPreview.style.transition =
            "none";

        photoPreview.style.transform =
            `translateX(${enterX})`;

        photoPreview.style.opacity =
            "0";

        atualizarContadorFotos();

        requestAnimationFrame(() => {

            photoPreview.style.transition =
                "transform 0.2s ease, opacity 0.2s ease";

            photoPreview.style.transform =
                "translateX(0)";

            photoPreview.style.opacity =
                "1";

            setTimeout(() => {

                photoPreview.style.transition =
                    "";

                photoPreview.style.transform =
                    "";

                photoPreview.style.opacity =
                    "";

                isPhotoAnimating =
                    false;

            }, 220);

        });

    }, 160);

}

carousel.addEventListener(
    "touchstart",
    (e) => {

        if (
            e.target.closest(".photo-menu-box")
        ) {
            return;
        }

        const printer =
            printers[currentPrinterIndex];

        if (
            !printer ||
            !printer.photos ||
            printer.photos.length <= 1 ||
            isPhotoAnimating
        ) {
            return;
        }

        if (e.touches.length !== 1) {
            return;
        }

        const touch =
            e.touches[0];

        photoSwipeStartX =
            touch.clientX;

        photoSwipeStartY =
            touch.clientY;

        photoSwipeDeltaX =
            0;

        photoSwipeActive =
            true;

        photoSwipeDragging =
            false;

    },
    { passive: true }
);

carousel.addEventListener(
    "touchmove",
    (e) => {

        if (!photoSwipeActive) {
            return;
        }

        if (e.touches.length !== 1) {
            return;
        }

        const touch =
            e.touches[0];

        const deltaX =
            touch.clientX - photoSwipeStartX;

        const deltaY =
            touch.clientY - photoSwipeStartY;

        const isHorizontalMove =
            Math.abs(deltaX) > 8 &&
            Math.abs(deltaX) > Math.abs(deltaY);

        if (!isHorizontalMove) {
            return;
        }

        e.preventDefault();

        photoSwipeDragging =
            true;

        photoSwipeDeltaX =
            deltaX;

        const limitedDeltaX =
            Math.max(
                -110,
                Math.min(110, deltaX)
            );

        const opacity =
            Math.max(
                0.45,
                1 - Math.abs(limitedDeltaX) / 180
            );

        photoPreview.classList.add(
            "photo-dragging"
        );

        photoPreview.style.transform =
            `translateX(${limitedDeltaX}px)`;

        photoPreview.style.opacity =
            opacity;

    },
    { passive: false }
);

carousel.addEventListener(
    "touchend",
    () => {

        if (!photoSwipeActive) {
            return;
        }

        photoSwipeActive =
            false;

        if (!photoSwipeDragging) {
            resetPhotoDragStyle();
            return;
        }

        const shouldChangePhoto =
            Math.abs(photoSwipeDeltaX) >= PHOTO_SWIPE_MIN_DISTANCE;

        if (!shouldChangePhoto) {

            photoPreview.classList.remove(
                "photo-dragging"
            );

            photoPreview.style.transition =
                "transform 0.18s ease, opacity 0.18s ease";

            photoPreview.style.transform =
                "translateX(0)";

            photoPreview.style.opacity =
                "1";

            setTimeout(() => {

                photoPreview.style.transition =
                    "";

                resetPhotoDragStyle();

            }, 180);

            return;

        }

        if (photoSwipeDeltaX < 0) {
            changePhotoAfterDrag("next");
        } else {
            changePhotoAfterDrag("prev");
        }

    }
);

// Adicionar foto
// Ler arquivo como base64
// Mensagem temporária no contador de fotos
let photoFeedbackTimer = null;

function showPhotoFeedback(message) {

    clearTimeout(photoFeedbackTimer);

    contadorFotos.textContent =
        message;

    contadorFotos.style.color =
        "var(--danger)";

    photoFeedbackTimer =
        setTimeout(() => {

            contadorFotos.style.color =
                "var(--primary)";

            atualizarContadorFotos();

        }, 2500);

}

// Compactar foto antes de salvar
function compressPhoto(file) {

    return new Promise((resolve, reject) => {

        if (!file.type.startsWith("image/")) {
            reject(new Error("Arquivo inválido."));
            return;
        }

        const reader =
            new FileReader();

        reader.onload = () => {

            const image =
                new Image();

            image.onload = () => {

                const originalWidth =
                    image.width;

                const originalHeight =
                    image.height;

                const scale =
                    Math.min(
                        MAX_PHOTO_WIDTH / originalWidth,
                        MAX_PHOTO_HEIGHT / originalHeight,
                        1
                    );

                const targetWidth =
                    Math.round(originalWidth * scale);

                const targetHeight =
                    Math.round(originalHeight * scale);

                const canvas =
                    document.createElement("canvas");

                canvas.width =
                    targetWidth;

                canvas.height =
                    targetHeight;

                const context =
                    canvas.getContext("2d");

                context.drawImage(
                    image,
                    0,
                    0,
                    targetWidth,
                    targetHeight
                );

                const compressedPhoto =
                    canvas.toDataURL(
                        "image/jpeg",
                        PHOTO_QUALITY
                    );

                resolve(compressedPhoto);

            };

            image.onerror = () => {
                reject(
                    new Error("Não foi possível carregar a imagem.")
                );
            };

            image.src =
                reader.result;

        };

        reader.onerror = () => {
            reject(reader.error);
        };

        reader.readAsDataURL(file);

    });

}

// Adicionar foto pela câmera ou galeria
async function handlePhotoInputChange(e) {

    const input =
        e.target;

    const files =
        [...input.files];

    if (files.length === 0) {
        return;
    }

    const printer =
        printers[currentPrinterIndex];

    if (!printer) {
        input.value = "";
        return;
    }

    if (!printer.photos) {
        printer.photos = [];
    }

    const availableSlots =
        MAX_PHOTOS_PER_PRINTER - printer.photos.length;

    if (availableSlots <= 0) {

        showPhotoFeedback(
            `Limite de ${MAX_PHOTOS_PER_PRINTER} fotos atingido.`
        );

        input.value = "";
        return;

    }

    const selectedFiles =
        files.slice(0, availableSlots);

    if (files.length > availableSlots) {

        showPhotoFeedback(
            `Só é possível adicionar mais ${availableSlots} foto(s).`
        );

    }

    try {

        const newPhotos =
            await Promise.all(
                selectedFiles.map(file =>
                    compressPhoto(file)
                )
            );

        printer.photos.push(...newPhotos);

        carousel.style.display =
            "inline-block";

        prevPhotoBtn.style.display =
            printer.photos.length > 1
                ? "block"
                : "none";

        nextPhotoBtn.style.display =
            printer.photos.length > 1
                ? "block"
                : "none";

        currentPhotoIndex =
            printer.photos.length - 1;

        photoPreview.src =
            printer.photos[currentPhotoIndex];

        atualizarContadorFotos();

        await syncPrinter(printer);

    } catch (error) {

        console.error(
            "Erro ao processar foto:",
            error
        );

        showPhotoFeedback(
            "Erro ao carregar foto."
        );

    } finally {

        input.value = "";

    }

}

photoInput.addEventListener(
    "change",
    handlePhotoInputChange
);

cameraInput.addEventListener(
    "change",
    handlePhotoInputChange
);

// Remover foto
removePhotoBtn.addEventListener("click", async () => {

    const printer = printers[currentPrinterIndex];

    if (!printer.photos || printer.photos.length === 0)
        return;

    printer.photos.splice(currentPhotoIndex, 1);

    if (printer.photos.length === 0) {

        carousel.style.display = "none";

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

    printer.macAddress =
        mMacAddress.value.trim();

    printer.printQueue =
        mPrintQueue.value.trim();

    printer.loc =
        mLoc.value;

    printer.col =
        mCol.value;

    printer.costCenter =
        mCostCenter.value.trim();

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
                    macAddress: "",
                    printQueue: "",
                    loc: "",
                    col: "",
                    costCenter: "",
                    notes: "",
                    backup: false,
                    photos: [],
                    contractNumber: activeContractNumber,
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
        macAddress: "",
        printQueue: "",
        loc: "",
        col: "",
        costCenter: "",
        notes: "",
        backup: false,
        photos: [],
        contractNumber: activeContractNumber,
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
let pinZoomRenderFrame = null;
let lastPinZoomScale = 1;

let resizePinsTimer = null;

window.addEventListener("resize", () => {

    clearTimeout(resizePinsTimer);

    resizePinsTimer =
        setTimeout(() => {

            expandedPinClusterId =
                null;

            renderPins();

        }, 150);

});

panzoomArea.addEventListener("panzoomchange", (e) => {

    const scale =
        e.detail.scale;

    if (
        Math.abs(scale - lastPinZoomScale) < 0.03
    ) {

        adjustPins(scale);

        return;

    }

    lastPinZoomScale =
        scale;

    if (pinZoomRenderFrame) {
        cancelAnimationFrame(
            pinZoomRenderFrame
        );
    }

    pinZoomRenderFrame =
        requestAnimationFrame(() => {

            renderPins();

            pinZoomRenderFrame =
                null;

        });

});

// Alternar modo de captura
toggleHelper.addEventListener('click', () => {

    const wasCaptureMode =
        captureMode;

    closeSidebarModes();

    if (wasCaptureMode) {
        return;
    }

    captureMode = true;

    expandedPinClusterId =
        null;

    toggleHelper.textContent =
        'Clique no mapa 2x para adicionar';

    renderPins();

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

    // helper to fetch best favicon from server
    async function fetchFavicon(url) {
        try {
            const resp = await fetch(`/api/favicon?url=${encodeURIComponent(url)}`);
            if (!resp.ok) throw new Error("no-favicon");
            const data = await resp.json();
            return data.url;
        } catch (e) {
            try {
                const domain = new URL(url).hostname;
                return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
            } catch (err) {
                return `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(url)}`;
            }
        }
    }

    sortedLinks.forEach(link => {

        const item = document.createElement("a");

        item.href = link.url;
        item.target = "_blank";
        item.className = "collapsed-sidebar-btn collapsed-link-btn";
        item.title = link.name;
        item.dataset.label = link.name;

        const domain = new URL(link.url).hostname;

        const defaultFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

        const img = document.createElement("img");
        img.src = defaultFavicon;
        img.alt = link.name;

        // async replace with best favicon
        fetchFavicon(link.url).then(url => {
            if (url) img.src = url;
        }).catch(() => {});

        item.appendChild(img);

        collapsedQuickLinksList.appendChild(item);

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

    const defaultFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    const img = document.createElement("img");
    img.className = "quick-link-favicon";
    img.alt = name;
    img.src = defaultFavicon;

    // try to fetch a better favicon from server
    (async () => {
        try {
            const resp = await fetch(`/api/favicon?url=${encodeURIComponent(url)}`);
            if (resp.ok) {
                const data = await resp.json();
                if (data.url) img.src = data.url;
            }
        } catch (e) {}
    })();

    const span = document.createElement("span");
    span.textContent = name;

    link.appendChild(img);
    link.appendChild(span);

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

function updateAdminPanelButton() {

    if (canManageCurrentContract()) {

        adminPanelBtn.textContent =
            "Gerenciar Usuários";

    } else {

        adminPanelBtn.textContent =
            "Usuários";

    }

    adminPanelBtn.style.display =
        "block";

}

adminPanelBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            canManageCurrentContract()
                ? "admin.html"
                : "users.html";

    }
);

collapsedUsersBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            canManageCurrentContract()
                ? "admin.html"
                : "users.html";

    }
);

updateAdminPanelButton();

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

async function startApp() {

    await loadContracts();

    await loadMaps();

    updatePlantImage();

    await loadPrinters();

    updatePermissionButtons();

    fetchQuickLinks();

}

startApp();

// Gabriel Salton
