const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username =
        document.getElementById("loginUser").value;

    const password =
        document.getElementById("loginPassword").value;

    try {

        const response =
            await fetch("/api/auth/login", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    password
                })
            });

        const data =
            await response.json();

        loginMessage.textContent =
            data.mensagem;

        if (response.ok) {

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            window.location.href = "index.html";

        }

    } catch (error) {

        loginMessage.textContent =
            "Erro ao fazer login.";

        console.error(error);

    }

});