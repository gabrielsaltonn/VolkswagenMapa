const loggedUser =
    JSON.parse(localStorage.getItem("user"));

if (!loggedUser) {
    window.location.href = "login.html";
}

if (loggedUser.role !== "admin") {
    alert("Acesso negado.");
    window.location.href = "index.html";
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

const userRole =
    document.getElementById(
        "userRole"
    );

const userPlant =
    document.getElementById(
        "userPlant"
    );

const userStatus =
    document.getElementById(
        "userStatus"
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
                    ${user.username}
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

function getInitials(name) {

    return name
        .split(" ")
        .map(part => part[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

}

function showUserModal(user) {

    selectedUser = user;

    userModalName.textContent =
        user.username;

    userRole.value =
        user.role;

    userPlant.value =
        user.plant;

    userStatus.textContent =
        user.status;

    userStatus.className =
        "user-status-box " + user.status;
        
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
                    ${user.username}
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

async function approveUser(id) {

    await fetch(
        `/api/auth/approve/${id}`,
        {
            method: "PATCH"
        }
    );

    await loadPendingUsers();
    await loadAllUsers();

}

async function rejectUser(id) {

    await fetch(
        `/api/auth/reject/${id}`,
        {
            method: "PATCH"
        }
    );

    await loadPendingUsers();
    await loadAllUsers();
}

saveUserBtn.addEventListener("click", async () => {

    if (!selectedUser) {
        return;
    }

    await fetch(`/api/auth/role/${selectedUser._id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            role: userRole.value
        })
    });

    await fetch(`/api/auth/plant/${selectedUser._id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            plant: userPlant.value
        })
    });

    userModal.style.display = "none";

    await loadPendingUsers();
    await loadAllUsers();
});

deleteUserBtn.addEventListener("click", async () => {

    if (!selectedUser) {
        return;
    }

    const confirmDelete =
        confirm(
            `Deseja realmente excluir o usuário ${selectedUser.username}?`
        );

    if (!confirmDelete) {
        return;
    }

    const response =
        await fetch(`/api/auth/users/${selectedUser._id}`, {
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

        alert(
            data.erro ||
            "Erro ao excluir usuário."
        );

        return;

    }

    userModal.style.display = "none";

    await loadPendingUsers();
    await loadAllUsers();

});

approveUserBtn.addEventListener(
    "click",
    async () => {

        if (!selectedUser) {
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

loadPendingUsers();
loadAllUsers();