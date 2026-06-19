document.addEventListener("DOMContentLoaded", () => {
    updateUI();

    const regBtn = document.getElementById('regBtn');
    if (regBtn) {
        regBtn.addEventListener('click', () => {
            const name = document.getElementById('name').value.trim();
            const surname = document.getElementById('surname').value.trim();
            const email = document.getElementById('email').value.trim();
            const pass = document.getElementById('pass').value.trim();

            const emailRegex = /@.+\./;

            if (!name || !surname || !email || !pass) {
                return alert("Заполните все поля!");
            }
            if (!emailRegex.test(email)) {
                return alert("Введите корректный Email (например, user@mail.ru)!");
            }

            let users = JSON.parse(localStorage.getItem('users') || "[]");

            if (users.find(u => u.email === email)) {
                return alert("Пользователь с таким Email уже существует!");
            }

            users.push({ name, surname, email, pass });
            localStorage.setItem('users', JSON.stringify(users));

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUserEmail', email);
            localStorage.setItem('userFullName', name + " " + surname);

            alert("Регистрация успешна!");
            window.location.href = "dashboard.html";
        });
    }

    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const cat = document.getElementById('catInput').value;
            const date = document.getElementById('dateInput').value;
            const sum = parseFloat(document.getElementById('sumInput').value);
            const type = document.getElementById('typeInput').value;
            const userEmail = localStorage.getItem('currentUserEmail');

            if (!cat || !date || isNaN(sum)) return alert("Заполните поля!");

            const key = 'transactions_' + userEmail;
            const list = JSON.parse(localStorage.getItem(key) || "[]");
            list.push({ cat, date, sum, type });
            localStorage.setItem(key, JSON.stringify(list));

            location.reload();
        });
    }
});

function updateUI() {
    const userEmail = localStorage.getItem('currentUserEmail');
    if (!userEmail) return;

    const key = 'transactions_' + userEmail;
    const transactions = JSON.parse(localStorage.getItem(key) || "[]");

    let balance = 0;
    let expenses = 0;

    transactions.forEach(t => {
        const amount = parseFloat(t.sum);
        if (t.type === 'plus') balance += amount;
        else { balance -= amount; expenses += amount; }
    });

    if (document.getElementById('accBalance')) {
        const balEl = document.getElementById('accBalance');
        balEl.innerText = (balance < 0 ? "- " : "") + Math.abs(balance).toLocaleString() + " ₽";
        balEl.style.color = balance < 0 ? "#dc3545" : "#333";
    }

    const budgetLimit = 50000;
    if (document.getElementById('budgetBar')) {
        const percent = Math.min((expenses / budgetLimit) * 100, 100);
        document.getElementById('budgetBar').style.width = percent + "%";
        document.getElementById('budgetStatus').innerText = `${expenses.toLocaleString()} из ${budgetLimit.toLocaleString()} ₽`;
    }

    const list = document.getElementById('recentTrans');
    if (list) {
        list.innerHTML = transactions.slice(-5).reverse().map(t =>
            `<li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0">
                <span>${t.cat}</span> 
                <span class="${t.type === 'plus' ? 'text-success' : 'text-danger'} fw-bold">
                    ${t.type === 'plus' ? '+' : '-'}${parseFloat(t.sum).toLocaleString()} ₽
                </span>
            </li>`
        ).join('');
    }

    const nameDisplay = document.getElementById('userNameDisplay');
    if (nameDisplay) nameDisplay.innerText = localStorage.getItem('userFullName') || "";
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('userFullName');
    window.location.href = 'index.html';
}