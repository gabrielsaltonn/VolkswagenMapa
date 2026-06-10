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

const allUsersList =
    document.getElementById(
        "allUsersList"
    );

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

let selectedUser = null;

async function loadPendingUsers() {

    try {

        const response =
            await fetch(
                "/api/auth/pending"
            );

        const users =
            await response.json();

        pendingUsersList.innerHTML = "";

        if (users.length === 0) {

            pendingUsersList.innerHTML =
                "<p>Nenhum usuário pendente.</p>";

            return;

        }

        users.forEach(user => {

            const div =
                document.createElement("div");

            div.innerHTML = `
                <strong>${user.username}</strong>
                (${user.plant})

                <button
                    onclick="approveUser('${user._id}')">
                    Aprovar
                </button>

                <button
                    onclick="rejectUser('${user._id}')">
                    Rejeitar
                </button>
            `;

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

    userStatus.value =
        user.status;

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

        allUsersList.innerHTML = "";

        users.forEach(user => {

            const div =
                document.createElement("div");

            div.className = "admin-user-card";

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

async function saveUserChanges(id) {

    const role =
        document.getElementById(`role-${id}`).value;

    const plant =
        document.getElementById(`plant-${id}`).value;

    await fetch(`/api/auth/role/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ role })
    });

    await fetch(`/api/auth/plant/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ plant })
    });

    await loadAllUsers();

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

async function deleteUser(id) {

    const confirmDelete =
        confirm(
            "Deseja realmente excluir este usuário?"
        );

    if (!confirmDelete) {
        return;
    }

    await fetch(
        `/api/auth/users/${id}`,
        {
            method: "DELETE"
        }
    );

    await loadAllUsers();

}

loadPendingUsers();
loadAllUsers();