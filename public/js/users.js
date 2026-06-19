const loggedUser =
    JSON.parse(
        localStorage.getItem("user")
    );

if (!loggedUser) {

    window.location.href =
        "login.html";

}

const backToMapBtn =
    document.getElementById(
        "backToMapBtn"
    );

const usersList =
    document.getElementById(
        "usersList"
    );

const usersCounter =
    document.getElementById(
        "usersCounter"
    );

const userSearch =
    document.getElementById(
        "userSearch"
    );

const userViewModal =
    document.getElementById(
        "userViewModal"
    );

const closeUserViewModal =
    document.getElementById(
        "closeUserViewModal"
    );

const userViewName =
    document.getElementById(
        "userViewName"
    );

const userViewRole =
    document.getElementById(
        "userViewRole"
    );

const userViewPlant =
    document.getElementById(
        "userViewPlant"
    );

const userViewStatus =
    document.getElementById(
        "userViewStatus"
    );

let users = [];

let userSearchText = "";

backToMapBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "index.html";

    }
);

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

function showUserViewModal(user) {

    userViewName.textContent =
        getDisplayName(user.username);

    userViewRole.textContent =
        user.role;

    userViewPlant.textContent =
        user.plant;

    userViewStatus.textContent =
        user.status;

    userViewStatus.className =
        "user-status-box " + user.status;

    userViewModal.style.display =
        "flex";

}

function renderUsers() {

    usersList.innerHTML =
        "";

    const filteredUsers =
        users.filter(user =>
            user.username
                .toLowerCase()
                .includes(userSearchText)
        );

    usersCounter.textContent =
        `Usuários: ${filteredUsers.length}`;

    if (filteredUsers.length === 0) {

        usersList.innerHTML =
            `
                <p class="empty-quick-links">
                    Nenhum usuário encontrado.
                </p>
            `;

        return;

    }

    filteredUsers.forEach(user => {

        const div =
            document.createElement("div");

        div.className =
            "admin-user-card";

        if (user.role === "admin") {

            div.classList.add(
                "admin-user-card-admin"
            );

        }

        div.innerHTML =
            `
                <div class="admin-user-avatar">
                    ${getInitials(user.username)}
                </div>

                <div class="admin-user-name">
                    ${getDisplayName(user.username)}
                </div>
            `;

        div.addEventListener(
            "click",
            () => {

                showUserViewModal(user);

            }
        );

        usersList.appendChild(div);

    });

}

async function loadUsers() {

    try {

        const response =
            await fetch(
                "/api/auth/users"
            );

        users =
            await response.json();

        renderUsers();

    } catch (error) {

        console.error(
            "Erro ao carregar usuários:",
            error
        );

    }

}

closeUserViewModal.addEventListener(
    "click",
    () => {

        userViewModal.style.display =
            "none";

    }
);

userViewModal.addEventListener(
    "click",
    (e) => {

        if (e.target === userViewModal) {

            userViewModal.style.display =
                "none";

        }

    }
);

userSearch.addEventListener(
    "input",
    (e) => {

        userSearchText =
            e.target.value
                .toLowerCase();

        renderUsers();

    }
);

loadUsers();