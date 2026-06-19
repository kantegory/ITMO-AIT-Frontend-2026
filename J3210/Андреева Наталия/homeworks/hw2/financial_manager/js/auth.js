document.addEventListener("DOMContentLoaded", async () => {
    const regBtn = document.getElementById('regBtn');
    if (regBtn) {
        regBtn.addEventListener('click', async () => {
            const name = document.getElementById('name').value.trim();
            const surname = document.getElementById('surname').value.trim();
            const email = document.getElementById('email').value.trim();
            const pass = document.getElementById('pass').value.trim();
            const emailRegex = /@.+\./;

            if (!name || !surname || !email || !pass) {
                return alert("Заполните все поля!");
            }
            if (!emailRegex.test(email)) {
                return alert("Введите корректный Email!");
            }

            try {
                const res = await fetch(`${API_URL}/users?email=${email}`);
                const existing = await res.json();
                if (existing.length > 0) {
                    return alert("Email уже занят!");
                }

                const createRes = await fetch(`${API_URL}/users`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({name, surname, email, pass})
                });

                if (createRes.ok) {
                    const newUser = await createRes.json();
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('currentUser', JSON.stringify(newUser));
                    localStorage.setItem('currentUserId', newUser.id.toString());
                    localStorage.setItem('userFullName', name + " " + surname);
                    window.location.href = "dashboard.html";
                }
            } catch (e) {
                alert("Нет связи с сервером!");
            }
        });
    }
});