const registerForm =
    document.getElementById("registerForm");

const registerMessage =
    document.getElementById("registerMessage");

registerForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const username =
            document.getElementById("registerUser").value;

        const password =
            document.getElementById("registerPassword").value;

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
                data.mensagem;

        } catch (error) {

            registerMessage.textContent =
                "Erro ao cadastrar usuário.";

            console.error(error);

        }

    }
);