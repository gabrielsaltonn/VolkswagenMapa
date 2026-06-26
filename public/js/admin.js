const loggedUser =
    JSON.parse(localStorage.getItem("user"));

if (!loggedUser) {
    window.location.href = "login.html";
}

const adminMessageModal =
    document.getElementById(
        "adminMessageModal"
    );

const adminMessageTitle =
    document.getElementById(
        "adminMessageTitle"
    );

const adminMessageText =
    document.getElementById(
        "adminMessageText"
    );

const closeAdminMessageModal =
    document.getElementById(
        "closeAdminMessageModal"
    );

const cancelAdminMessageBtn =
    document.getElementById(
        "cancelAdminMessageBtn"
    );

const confirmAdminMessageBtn =
    document.getElementById(
        "confirmAdminMessageBtn"
    );

let adminMessageCallback =
    null;

function showAdminMessageModal(
    title,
    message,
    callback = null,
    showCancel = false
) {

    adminMessageTitle.textContent =
        title;

    adminMessageText.innerHTML =
        message;

    adminMessageCallback =
        callback;

    cancelAdminMessageBtn.style.display =
        showCancel
            ? "inline-block"
            : "none";

    adminMessageModal.style.display =
        "flex";

}

closeAdminMessageModal.addEventListener(
    "click",
    () => {

        adminMessageModal.style.display =
            "none";

    }
);

cancelAdminMessageBtn.addEventListener(
    "click",
    () => {

        adminMessageModal.style.display =
            "none";

    }
);

adminMessageModal.addEventListener(
    "click",
    (e) => {

        if (e.target === adminMessageModal) {

            adminMessageModal.style.display =
                "none";

        }

    }
);

confirmAdminMessageBtn.addEventListener(
    "click",
    async () => {

        adminMessageModal.style.display =
            "none";

        if (adminMessageCallback) {

            const callback =
                adminMessageCallback;

            adminMessageCallback =
                null;

            await callback();

        }

    }
);

const SUPER_ADMIN_USERS = [
    "admin@simpress.com.br",
    "admin.dev@simpress.com.br"
];

function isSuperAdminUser() {

    return SUPER_ADMIN_USERS.includes(
        String(loggedUser.username || "")
            .trim()
            .toLowerCase()
    );

}

function canAccessAdminPage() {

    return (
        loggedUser.role === "admin" ||
        loggedUser.role === "gestor"
    );

}

if (!canAccessAdminPage()) {

    showAdminMessageModal(
        "Acesso negado",
        "Você não tem permissão para acessar esta página.",
        () => {

            window.location.href =
                "index.html";

        }
    );

    throw new Error(
        "Acesso negado"
    );

}

const backToMapBtn =
    document.getElementById("backToMapBtn");

backToMapBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});

const pendingUsersList =
    document.getElementById(
        "pendingUsersList"
    );

const pendingSection =
    document.getElementById(
        "pendingSection"
    );

const activeUsersCounter =
    document.getElementById(
        "activeUsersCounter"
    );

const pendingUsersCounter =
    document.getElementById(
        "pendingUsersCounter"
    );

const adminUsersCounter =
    document.getElementById(
        "adminUsersCounter"
    );

const allUsersList =
    document.getElementById(
        "allUsersList"
    );

const contractsList =
    document.getElementById(
        "contractsList"
    );

const userSearch =
    document.getElementById(
        "userSearch"
    );

let userSearchText = "";

const userModal =
    document.getElementById(
        "userModal"
    );

const closeUserModal =
    document.getElementById(
        "closeUserModal"
    );

const userModalName =
    document.getElementById(
        "userModalName"
    );

const userSystemRole =
    document.getElementById(
        "userSystemRole"
    );

function updateSystemRoleOptions(user) {

    const gestorOption =
        userSystemRole.querySelector(
            'option[value="gestor"]'
        );

    if (!gestorOption) {
        return;
    }

    if (isSuperAdminUser()) {

        gestorOption.hidden =
            false;

        gestorOption.disabled =
            false;

        userSystemRole.disabled =
            false;

        return;

    }

    gestorOption.hidden =
        true;

    gestorOption.disabled =
        true;

    userSystemRole.disabled =
        true;

    userSystemRole.value =
        "user";

}

const userStatus =
    document.getElementById(
        "userStatus"
    );

const userAccessList =
    document.getElementById(
        "userAccessList"
    );

const addUserAccessBtn =
    document.getElementById(
        "addUserAccessBtn"
    );

const saveUserBtn =
    document.getElementById(
        "saveUserBtn"
    );

const approveUserBtn =
    document.getElementById(
        "approveUserBtn"
    );

const rejectUserBtn =
    document.getElementById(
        "rejectUserBtn"
    );

const deleteUserBtn =
    document.getElementById(
        "deleteUserBtn"
    );

let selectedUser = null;
let contracts = [];

let selectedUserAccessDraft = [];
let expandedUserAccessIndexes = new Set();

const ACCESS_ROLE_OPTIONS = [
    "user",
    "admin"
];

let contractPlants = {};

async function loadPendingUsers() {

    try {

        const response =
            await fetch(
                "/api/auth/pending"
            );

        const users =
            await response.json();

        pendingUsersCounter.textContent =
            ` | Pendentes: ${users.length}`;

        pendingUsersList.innerHTML = "";
        pendingSection.style.display = users.length > 0 ? "block" : "none";

        if (users.length === 0) {
            return;
        }

        users.forEach(user => {

           const div =
                document.createElement("div");

            div.className =
                "admin-user-card";

            if (
                user.role === "admin" ||
                user.role === "gestor"
            ) {
                div.classList.add("admin-user-card-admin");
            }

            div.innerHTML = `
                <div class="admin-user-avatar">
                    ${getInitials(user.username)}
                </div>

                <div class="admin-user-name">
                    ${getDisplayName(user.username)}
                </div>
            `;

            div.addEventListener("click", () => {
                showUserModal(user);
            });

            pendingUsersList.appendChild(div);

        });

    } catch (error) {

        console.error(error);

    }

}

function getDisplayName(username) {

    const name =
        username.includes("@")
            ? username.split("@")[0]
            : username;

    return name
        .split(".")
        .filter(part => part)
        .map(part =>
            part.charAt(0).toUpperCase() +
            part.slice(1)
        )
        .join(" ");

}

function getInitials(username) {

    return getDisplayName(username)
        .split(" ")
        .map(part => part[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

}

async function loadContracts() {

    try {

        const params =
            new URLSearchParams({
                loggedUsername:
                    loggedUser.username
            });

        const response =
            await fetch(
                `/api/contracts?${params.toString()}`
            );

        const data =
            await response.json();

        contracts =
            Array.isArray(data)
                ? data
                : [];

        await Promise.all(
            contracts.map(contract =>
                loadPlantsForContract(
                    contract.number
                )
            )
        );

    } catch (error) {

        console.error(
            "Erro ao carregar contratos:",
            error
        );

        contracts = [];

    }

}

function renderContracts() {

    contractsList.innerHTML = "";

    if (contracts.length === 0) {

        contractsList.innerHTML = `
            <div class="admin-contract-empty">
                Nenhum contrato cadastrado.
            </div>
        `;

        return;

    }

    contracts.forEach(contract => {

        const div =
            document.createElement("div");

        div.className =
            "admin-contract-card";

        div.innerHTML = `
            <strong class="admin-contract-name">
                ${contract.name}
            </strong>

            <div class="admin-contract-number">
                Número: ${contract.number}
            </div>

            <span class="admin-contract-status">
                ${contract.status}
            </span>
        `;

        contractsList.appendChild(div);

    });

}

async function loadPlantsForContract(contractNumber) {

    try {

        const params =
            new URLSearchParams({
                contractNumber,
                loggedUsername:
                    loggedUser.username
            });

        const response =
            await fetch(
                `/api/maps?${params.toString()}`
            );

        const maps =
            await response.json();

        const mapPlants =
            Array.isArray(maps)
                ? maps.map(map => map.name)
                : [];

        contractPlants[contractNumber] =
            [
                "ALL",
                ...new Set(mapPlants)
            ];

    } catch (error) {

        console.error(
            "Erro ao carregar plantas do contrato:",
            contractNumber,
            error
        );

        contractPlants[contractNumber] =
            ["ALL"];

    }

}

function getPlantOptionsForContract(
    contractNumber,
    selectedPlants = []
) {

    const plantsFromMaps =
        contractPlants[contractNumber] ||
        ["ALL"];

    return [
        ...new Set([
            ...plantsFromMaps,
            ...selectedPlants
        ])
    ];

}

function getContractLabel(contractNumber) {

    if (!contractNumber) {
        return "Selecione um contrato";
    }

    const contract =
        contracts.find(item =>
            item.number === contractNumber
        );

    if (!contract) {
        return contractNumber;
    }

    return `${contract.name} - ${contract.number}`;

}

function normalizeContractSearch(value) {

    return String(value || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}

function getContractOptionLabel(contract) {

    return `${contract.name} - ${contract.number}`;

}

function getAvailableContractsForAccess(currentContractNumber) {

    const usedContracts =
        selectedUserAccessDraft
            .map(accessItem => accessItem.contractNumber)
            .filter(contractNumber =>
                contractNumber &&
                contractNumber !== currentContractNumber
            );

    return contracts.filter(contract =>
        !usedContracts.includes(contract.number)
    );

}

function getContractDatalistOptionsHtml(currentContractNumber) {

    return getAvailableContractsForAccess(currentContractNumber)
        .map(contract => `
            <option value="${getContractOptionLabel(contract)}"></option>
        `)
        .join("");

}

function findContractByInputValue(value, currentContractNumber) {

    const normalizedValue =
        normalizeContractSearch(value);

    if (!normalizedValue) {
        return null;
    }

    const availableContracts =
        getAvailableContractsForAccess(currentContractNumber);

    return availableContracts.find(contract => {

        const label =
            normalizeContractSearch(
                getContractOptionLabel(contract)
            );

        const number =
            normalizeContractSearch(
                contract.number
            );

        const name =
            normalizeContractSearch(
                contract.name
            );

        return (
            label === normalizedValue ||
            number === normalizedValue ||
            name === normalizedValue
        );

    });

}

function getUserAccessList(user) {

    if (
        user.access &&
        user.access.length > 0
    ) {
        return user.access;
    }

    if (user.status === "pending") {
        return [];
    }

    return [
        {
            contractNumber: "1234",
            role: user.role || "user",
            plants: [user.plant || "SJP"]
        }
    ];

}

function renderUserAccessList(user) {

    selectedUserAccessDraft =
        getUserAccessList(user).map(accessItem => ({
            contractNumber: accessItem.contractNumber,
            role: accessItem.role,
            plants: [...(accessItem.plants || [])]
        }));

    expandedUserAccessIndexes =
        new Set();

    renderUserAccessEditor();

}

function renderUserAccessEditor() {

    userAccessList.innerHTML = "";

    if (selectedUserAccessDraft.length === 0) {

        userAccessList.innerHTML = `
            <div class="user-access-empty">
                Nenhum contrato selecionado. Clique em
                <strong>+ Adicionar contrato</strong>
                para definir o acesso do usuário.
            </div>
        `;

        return;

    }

    selectedUserAccessDraft.forEach((accessItem, index) => {

        const div =
            document.createElement("div");

        const isExpanded =
            expandedUserAccessIndexes.has(index);

        div.className =
            isExpanded
                ? "user-access-item expanded"
                : "user-access-item collapsed";

        const hasSelectedContract =
            Boolean(accessItem.contractNumber);

        const plantOptions =
            hasSelectedContract
                ? getPlantOptionsForContract(
                    accessItem.contractNumber,
                    accessItem.plants || []
                )
                : [];

        div.innerHTML = `
            <button
                type="button"
                class="user-access-summary">
                <span>
                    ${getContractLabel(accessItem.contractNumber)}
                </span>

                <span class="user-access-toggle-icon">
                    ${isExpanded ? "▲" : "▼"}
                </span>
            </button>

            <div class="user-access-details">
                <label>
                    Contrato

                    <input
                        class="access-contract-combo"
                        type="search"
                        list="contract-options-${index}"
                        placeholder="Digite nome ou número..."
                        autocomplete="off"
                        value="${accessItem.contractNumber ? getContractLabel(accessItem.contractNumber) : ""}">

                    <datalist id="contract-options-${index}">
                        ${getContractDatalistOptionsHtml(accessItem.contractNumber)}
                    </datalist>
                </label>

                ${hasSelectedContract ? `
                    <label>
                        Tipo de acesso

                        <select class="access-role-select">
                            ${ACCESS_ROLE_OPTIONS.map(role => `
                                <option
                                    value="${role}"
                                    ${role === accessItem.role ? "selected" : ""}>
                                    ${role}
                                </option>
                            `).join("")}
                        </select>
                    </label>

                    <label>
                        Planta

                        <div class="user-access-plants-editor">
                            ${plantOptions.map(plant => `
                                <label class="user-access-plant-check">
                                    <input
                                        type="checkbox"
                                        value="${plant}"
                                        ${accessItem.plants.includes(plant) ? "checked" : ""}>
                                    ${plant}
                                </label>
                            `).join("")}
                        </div>
                    </label>
                ` : `
                    <div class="user-access-empty">
                        Selecione um contrato para configurar tipo de acesso e planta.
                    </div>
                `}

                <button
                    type="button"
                    class="remove-user-access-btn">
                    Remover acesso
                </button>
            </div>
        `;

        const summaryBtn =
            div.querySelector(
                ".user-access-summary"
            );

        const contractComboInput =
            div.querySelector(
                ".access-contract-combo"
            );

        const roleSelect =
            div.querySelector(
                ".access-role-select"
            );

        const plantCheckboxes =
            div.querySelectorAll(
                ".user-access-plant-check input"
            );

        const removeBtn =
            div.querySelector(
                ".remove-user-access-btn"
            );

        summaryBtn.addEventListener(
            "click",
            () => {

                if (expandedUserAccessIndexes.has(index)) {

                    expandedUserAccessIndexes.delete(index);

                } else {

                    expandedUserAccessIndexes.add(index);

                }

                renderUserAccessEditor();

            }
        );

        contractComboInput.addEventListener(
            "input",
            () => {

                const selectedContract =
                    findContractByInputValue(
                        contractComboInput.value,
                        accessItem.contractNumber
                    );

                if (!selectedContract) {
                    return;
                }

                selectedUserAccessDraft[index].contractNumber =
                    selectedContract.number;

                selectedUserAccessDraft[index].role =
                    selectedUserAccessDraft[index].role || "user";

                selectedUserAccessDraft[index].plants =
                    ["ALL"];

                expandedUserAccessIndexes.add(index);

                renderUserAccessEditor();

            }
        );

        contractComboInput.addEventListener(
            "blur",
            () => {

                const currentContractNumber =
                    selectedUserAccessDraft[index]?.contractNumber;

                if (!currentContractNumber) {
                    contractComboInput.value = "";
                    return;
                }

                contractComboInput.value =
                    getContractLabel(currentContractNumber);

            }
        );

        if (roleSelect) {

            roleSelect.addEventListener(
                "change",
                () => {

                    selectedUserAccessDraft[index].role =
                        roleSelect.value;

                }
            );

        }

        plantCheckboxes.forEach(checkbox => {

            checkbox.addEventListener(
                "change",
                () => {

                    const checkedPlants =
                        [...plantCheckboxes]
                            .filter(item => item.checked)
                            .map(item => item.value);

                    if (checkedPlants.includes("ALL")) {

                        selectedUserAccessDraft[index].plants =
                            ["ALL"];

                    } else {

                        selectedUserAccessDraft[index].plants =
                            checkedPlants;

                    }

                    expandedUserAccessIndexes.add(index);

                    renderUserAccessEditor();

                }
            );

        });

        removeBtn.addEventListener(
            "click",
            () => {

                selectedUserAccessDraft.splice(index, 1);

                expandedUserAccessIndexes =
                    new Set();

                renderUserAccessEditor();

            }
        );

        userAccessList.appendChild(div);

    });

}

function updateUserAccessVisibility() {

    const userAccessSection =
        document.querySelector(
            ".user-access-section"
        );

    if (!userAccessSection) {
        return;
    }

    if (userSystemRole.value === "gestor") {

        userAccessSection.style.display =
            "none";

    } else {

        userAccessSection.style.display =
            "block";

    }

}

function showUserModal(user) {

    selectedUser = user;

    userModalName.textContent =
        getDisplayName(user.username);

    updateSystemRoleOptions(user);

    userSystemRole.value =
        isSuperAdminUser() && user.role === "gestor"
            ? "gestor"
            : "user";

    updateUserAccessVisibility();

    userStatus.textContent =
        user.status;

    userStatus.className =
        "user-status-box " + user.status;

    renderUserAccessList(user);
        
        if (user.status === "pending") {

            approveUserBtn.style.display =
                "block";

            rejectUserBtn.style.display =
                "block";

            saveUserBtn.style.display =
                "none";

            deleteUserBtn.style.display =
                "none";

        } else {

            approveUserBtn.style.display =
                "none";

            rejectUserBtn.style.display =
                "none";

            saveUserBtn.style.display =
                "block";

            deleteUserBtn.style.display =
                "block";

        }

    userModal.style.display =
        "flex";

}

closeUserModal.addEventListener(
    "click",
    () => {

        userModal.style.display =
            "none";

    }
);

userSystemRole.addEventListener(
    "change",
    () => {

        updateUserAccessVisibility();

    }
);

addUserAccessBtn.addEventListener(
    "click",
    () => {

        const usedContracts =
            selectedUserAccessDraft.map(accessItem =>
                accessItem.contractNumber
            );

        const availableContract =
            contracts.find(contract =>
                !usedContracts.includes(contract.number)
            );

        if (!availableContract) {

            showAdminMessageModal(
                "Sem contratos disponíveis",
                "Todos os contratos ativos já foram adicionados para este usuário."
            );

            return;

        }

        selectedUserAccessDraft.push({
            contractNumber: "",
            role: "user",
            plants: []
        });

        expandedUserAccessIndexes.add(
            selectedUserAccessDraft.length - 1
        );

        renderUserAccessEditor();

    }
);

async function loadAllUsers() {

    try {

        const response =
            await fetch(
                "/api/auth/users"
            );

        const users =
            await response.json();

        activeUsersCounter.textContent =
            `Ativos: ${users.length}`;

        const managers =
            users.filter(user =>
                user.role === "admin" ||
                user.role === "gestor"
            ).length;

        adminUsersCounter.textContent =
            ` | Admin/Gestor: ${managers}`;

        allUsersList.innerHTML = "";

        users
            .filter(user =>
                user.username
                    .toLowerCase()
                    .includes(userSearchText)
            )
            .forEach(user => {

            const div =
                document.createElement("div");

            div.className = "admin-user-card";

            if (
                user.role === "admin" ||
                user.role === "gestor"
            ) {
                div.classList.add("admin-user-card-admin");
            }

            div.innerHTML = `
                <div class="admin-user-avatar">
                    ${getInitials(user.username)}
                </div>

                <div class="admin-user-name">
                    ${getDisplayName(user.username)}
                </div>
            `;

            div.addEventListener("click", () => {
                showUserModal(user);
            });

            allUsersList.appendChild(div);

        });

    } catch (error) {

        console.error(error);

    }

}

saveUserBtn.addEventListener("click", async () => {

    if (!selectedUser) {
        return;
    }

    if (userSystemRole.value === "gestor") {

        const response =
            await fetch(
                `/api/auth/role/${selectedUser._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        role: "gestor",
                        loggedUsername: loggedUser.username
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            showAdminMessageModal(
                "Erro",
                data.erro ||
                "Erro ao salvar gestor."
            );

            return;

        }

        userModal.style.display =
            "none";

        await loadPendingUsers();
        await loadAllUsers();

        return;

    }

    if (selectedUserAccessDraft.length === 0) {

        showAdminMessageModal(
            "Acesso obrigatório",
            "O usuário precisa ter pelo menos um acesso."
        );

        return;

    }

    const hasInvalidAccess =
        selectedUserAccessDraft.some(accessItem =>
            !accessItem.contractNumber ||
            !accessItem.role ||
            !accessItem.plants ||
            accessItem.plants.length === 0
        );

    if (hasInvalidAccess) {

        showAdminMessageModal(
            "Acesso incompleto",
            "Confira se todos os acessos possuem contrato, tipo de acesso e pelo menos uma planta."
        );

        return;

    }

    const response =
        await fetch(
            `/api/auth/access/${selectedUser._id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    loggedUsername:
                        loggedUser.username,
                    access:
                        selectedUserAccessDraft
                })
            }
        );

    const data =
        await response.json();

    if (!response.ok) {

        showAdminMessageModal(
            "Erro",
            data.erro ||
            "Erro ao salvar acessos do usuário."
        );

        return;

    }

    userModal.style.display =
        "none";

    await loadPendingUsers();
    await loadAllUsers();

});

deleteUserBtn.addEventListener(
    "click",
    async () => {

        if (!selectedUser) {
            return;
        }

        showAdminMessageModal(
            "Excluir usuário",
            `Deseja realmente excluir o usuário <strong>${selectedUser.username}</strong>?`,
            async () => {

                const response =
                    await fetch(
                        `/api/auth/users/${selectedUser._id}`, 
                        {
                        method: "DELETE",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            loggedUsername: loggedUser.username
                        })
                    });

                const data =
                    await response.json();

                if (!response.ok) {

                    showAdminMessageModal(
                        "Erro",
                        data.erro ||
                        "Erro ao excluir usuário."
                    );

                    return;

                }

                userModal.style.display =
                    "none";

                await loadPendingUsers();

                await loadAllUsers();

            },
            true
        );

    }
);

approveUserBtn.addEventListener(
    "click",
    async () => {

        if (!selectedUser) {
            return;
        }

        if (userSystemRole.value === "gestor") {

            const roleResponse =
                await fetch(
                    `/api/auth/role/${selectedUser._id}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            role: "gestor",
                            loggedUsername: loggedUser.username
                        })
                    }
                );

            const roleData =
                await roleResponse.json();

            if (!roleResponse.ok) {

                showAdminMessageModal(
                    "Erro",
                    roleData.erro ||
                    "Erro ao definir usuário como gestor."
                );

                return;

            }

            const approveResponse =
                await fetch(
                    `/api/auth/approve/${selectedUser._id}`,
                    {
                        method: "PATCH"
                    }
                );

            const approveData =
                await approveResponse.json();

            if (!approveResponse.ok) {

                showAdminMessageModal(
                    "Erro",
                    approveData.erro ||
                    "Erro ao aprovar gestor."
                );

                return;

            }

            userModal.style.display =
                "none";

            await loadPendingUsers();
            await loadAllUsers();

            return;

        }

        if (selectedUserAccessDraft.length === 0) {

            showAdminMessageModal(
                "Acesso obrigatório",
                "Defina pelo menos um acesso antes de aprovar o usuário."
            );

            return;

        }

        const accessResponse =
            await fetch(
                `/api/auth/access/${selectedUser._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        loggedUsername:
                            loggedUser.username,
                        access:
                            selectedUserAccessDraft
                    })
                }
            );

        const accessData =
            await accessResponse.json();

        if (!accessResponse.ok) {

            showAdminMessageModal(
                "Erro",
                accessData.erro ||
                "Erro ao salvar acessos do usuário."
            );

            return;

        }

        await fetch(
            `/api/auth/approve/${selectedUser._id}`,
            {
                method: "PATCH"
            }
        );

        userModal.style.display =
            "none";

        await loadPendingUsers();
        await loadAllUsers();

    }
);

rejectUserBtn.addEventListener(
    "click",
    async () => {

        if (!selectedUser) {
            return;
        }

        showAdminMessageModal(
            "Rejeitar usuário",
            `Deseja realmente rejeitar e remover o cadastro de <strong>${selectedUser.username}</strong>?`,
            async () => {

                const response =
                    await fetch(
                        `/api/auth/reject/${selectedUser._id}`,
                        {
                            method: "PATCH"
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    showAdminMessageModal(
                        "Erro",
                        data.erro ||
                        "Erro ao rejeitar usuário."
                    );

                    return;

                }

                userModal.style.display =
                    "none";

                await loadPendingUsers();
                await loadAllUsers();

            },
            true
        );

    }
);

userSearch.addEventListener(
    "input",
    (e) => {

        userSearchText =
            e.target.value.toLowerCase();

        loadAllUsers();

    }
);

async function startAdminPage() {

    await loadContracts();

    renderContracts();

    await loadPendingUsers();

    await loadAllUsers();

}

startAdminPage();