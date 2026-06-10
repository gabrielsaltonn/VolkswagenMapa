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

                div.innerHTML = `
                    <strong>${user.username}</strong>

                    | Role:
                    <select id="role-${user._id}">
                        <option value="user" ${user.role === "user" ? "selected" : ""}>
                            user
                        </option>

                        <option value="admin" ${user.role === "admin" ? "selected" : ""}>
                            admin
                        </option>
                    </select>

                    | Planta:
                    <select id="plant-${user._id}">
                        <option value="ANC" ${user.plant === "ANC" ? "selected" : ""}>ANC</option>
                        <option value="SCAR" ${user.plant === "SCAR" ? "selected" : ""}>SCAR</option>
                        <option value="SJP" ${user.plant === "SJP" ? "selected" : ""}>SJP</option>
                        <option value="TAUB" ${user.plant === "TAUB" ? "selected" : ""}>TAUB</option>
                        <option value="VIN" ${user.plant === "VIN" ? "selected" : ""}>VIN</option>
                        <option value="ALL" ${user.plant === "ALL" ? "selected" : ""}>ALL</option>
                    </select>

                    | Status:
                    ${user.status}

                    <button onclick="saveUserChanges('${user._id}')">
                        Salvar
                    </button>

                    <button onclick="deleteUser('${user._id}')">
                        Excluir
                    </button>
                `;

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

async function toggleRole(
    id,
    currentRole
) {

    const newRole =
        currentRole === "admin"
            ? "user"
            : "admin";

    await fetch(
        `/api/auth/role/${id}`,
        {
            method: "PATCH",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                role: newRole
            })
        }
    );

    await loadAllUsers();

}

loadPendingUsers();
loadAllUsers();