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

if (loggedUser.role !== "admin") {

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
    document.getElementById("pendingSection");

const activeUsersCounter =
    document.getElementById("activeUsersCounter");

const pendingUsersCounter =
    document.getElementById("pendingUsersCounter");

const adminUsersCounter =
    document.getElementById("adminUsersCounter");

const allUsersList =
    document.getElementById(
        "allUsersList"
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

const ACCESS_ROLE_OPTIONS = [
    "user",
    "admin",
    "gestor"
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

            if (user.role === "admin") {
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

        const response =
            await fetch("/api/contracts");

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

    const contract =
        contracts.find(item =>
            item.number === contractNumber
        );

    if (!contract) {
        return contractNumber;
    }

    return `${contract.name} - ${contract.number}`;

}

function getContractOptionsHtml(currentContractNumber) {

    const usedContracts =
        selectedUserAccessDraft
            .map(accessItem => accessItem.contractNumber)
            .filter(contractNumber =>
                contractNumber !== currentContractNumber
            );

    return contracts
        .filter(contract =>
            !usedContracts.includes(contract.number)
        )
        .map(contract => `
            <option
                value="${contract.number}"
                ${contract.number === currentContractNumber ? "selected" : ""}>
                ${contract.name} - ${contract.number}
            </option>
        `)
        .join("");

}

function getUserAccessList(user) {

    if (
        user.access &&
        user.access.length > 0
    ) {
        return user.access;
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

    renderUserAccessEditor();

}

function renderUserAccessEditor() {

    userAccessList.innerHTML = "";

    if (selectedUserAccessDraft.length === 0) {

        userAccessList.innerHTML = `
            <div class="user-access-empty">
                Nenhum acesso cadastrado.
            </div>
        `;

        return;

    }

    selectedUserAccessDraft.forEach((accessItem, index) => {

        const div =
            document.createElement("div");

        div.className =
            "user-access-item";

        const plantOptions =
            getPlantOptionsForContract(
                accessItem.contractNumber,
                accessItem.plants || []
            );

        div.innerHTML = `
            <label>
                Contrato

                <select class="access-contract-select">
                    ${getContractOptionsHtml(accessItem.contractNumber)}
                </select>
            </label>

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

            <button
                type="button"
                class="remove-user-access-btn">
                Remover acesso
            </button>
        `;

        const contractSelect =
            div.querySelector(
                ".access-contract-select"
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

        contractSelect.addEventListener(
            "change",
            () => {

                selectedUserAccessDraft[index].contractNumber =
                    contractSelect.value;

                renderUserAccessEditor();

            }
        );

        roleSelect.addEventListener(
            "change",
            () => {

                selectedUserAccessDraft[index].role =
                    roleSelect.value;

            }
        );

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

                    renderUserAccessEditor();

                }
            );

        });

        removeBtn.addEventListener(
            "click",
            () => {

                selectedUserAccessDraft.splice(index, 1);

                renderUserAccessEditor();

            }
        );

        userAccessList.appendChild(div);

    });

}

function showUserModal(user) {

    selectedUser = user;

    userModalName.textContent =
        getDisplayName(user.username);

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
            contractNumber: availableContract.number,
            role: "user",
            plants: ["ALL"]
        });

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

        const admins =
            users.filter(user => user.role === "admin").length;

        adminUsersCounter.textContent =
            ` | Adm's: ${admins}`;

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

            if (user.role === "admin") {
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

        await fetch(
            `/api/auth/reject/${selectedUser._id}`,
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

    await loadPendingUsers();

    await loadAllUsers();

}

startAdminPage();