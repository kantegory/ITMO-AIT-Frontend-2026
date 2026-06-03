document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById("email").value.trim();
            const passwordInput = document.getElementById("password").value.trim();

            try {
                const response = await axios.get('http://localhost:3000/users', {
                    params: { email: emailInput }
                });

                const users = response.data;

                if (users.length > 0) {
                    const user = users[0];

                    if (user.password === passwordInput) {
                        localStorage.setItem("currentUser", JSON.stringify(user));
                        window.location.href = "index.html";
                    } else {
                        alert("Неверный пароль!");
                    }
                } else {
                    alert("Пользователь с таким email не найден!");
                }

            } catch (error) {
                console.error("Ошибка API:", error);
                alert("Не удалось связаться с сервером.");
            }
        });
    }
});

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nameEl = document.getElementById("regName");
        const emailEl = document.getElementById("regEmail");
        const passEl = document.getElementById("regPassword");

        if (!nameEl || !emailEl || !passEl) {
            console.error("Один из элементов формы не найден! Проверьте ID в HTML.");
            return;
        }

        const newUser = {
            name: nameEl.value.trim(),
            email: emailEl.value.trim(),
            password: passEl.value.trim()
        };

        console.log("Данные для регистрации:", newUser);

        try {
            const checkRes = await axios.get(`http://localhost:3000/users?email=${newUser.email}`);

            if (checkRes.data.length > 0) {
                alert("Пользователь с таким email уже существует!");
                return;
            }

            await axios.post('http://localhost:3000/users', newUser);

            alert("Регистрация успешна!");
            window.location.href = "login.html";

        } catch (error) {
            console.error("Ошибка при регистрации:", error);
            alert("Не удалось сохранить пользователя. Проверьте, запущен ли json-server.");
        }
    });
}
