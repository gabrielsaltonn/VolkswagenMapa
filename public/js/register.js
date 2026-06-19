const registerForm =
    document.getElementById("registerForm");

const registerMessage =
    document.getElementById("registerMessage");

registerForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const username =
            document.getElementById("registerUser")
                .value
                .trim()
                .toLowerCase();

        const password =
            document.getElementById("registerPassword")
                .value;

        if (!username || !password) {

            registerMessage.textContent =
                "Preencha usuário e senha.";

            return;

        }

        if (!username.endsWith("@simpress.com.br")) {

            registerMessage.textContent =
                "Use seu e-mail corporativo @simpress.com.br.";

            return;

        }

        try {

            const response =
                await fetch(
                    "/api/auth/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            username,
                            password
                        })
                    }
                );

            const data =
                await response.json();

            registerMessage.textContent =
                data.mensagem ||
                data.erro ||
                "Erro ao cadastrar usuário.";

        } catch (error) {

            registerMessage.textContent =
                "Erro ao cadastrar usuário.";

            console.error(error);

        }

    }
);