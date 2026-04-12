const myModels = [
    { id: 1, name: "Image Classifier Pro", framework: "PyTorch", size: "120MB", tag: "CV", date: "12.05.2024" },
    { id: 2, name: "NLP Sentiment Analysis", framework: "Transformers", size: "450MB", tag: "NLP", date: "10.05.2024" },
    { id: 3, name: "Stock Predictor", framework: "Scikit-learn", size: "15MB", tag: "Finance", date: "08.05.2024" }
];

const myDatasets = [
    { id: 1, name: "Cats vs Dogs HD", format: "Images (JPG)", size: "2.1GB", tag: "Vision", date: "11.05.2024" },
    { id: 2, name: "Russian Wiki Text", format: "JSONL", size: "850MB", tag: "NLP", date: "09.05.2024" },
    { id: 3, name: "Customer Churn CSV", format: "CSV", size: "12MB", tag: "Tabular", date: "05.05.2024" }
];

const mySubscriptions = [
    { id: 1, name: "NLP Research Group", type: "Community", updates: "5 новых моделей", date: "12.04.2026" },
    { id: 2, name: "Visionary AI", type: "Author", updates: "1 датасет", date: "10.04.2026" },
    { id: 3, name: "Open Source LLMs", type: "Community", updates: "Без обновлений", date: "01.04.2026" }
];

document.addEventListener("DOMContentLoaded", () => {
    fakeAuthCheck();
    handleLogout();
    renderModels();
    renderDatasets();
    renderSubscriptions();
    loadSettings();
    handleSettingsSave();
    setupAvatarUpload();
    setupUploadModal();
});

function renderModels() {
    const dashboardContainer = document.querySelector("#dashboard-models-row");
    const tableBody = document.querySelector("#models-table-body");

    if (dashboardContainer) {
        dashboardContainer.innerHTML = myModels.map(model => `
            <div class="col-md-4">
                <div class="card card-item p-3">
                    <h6 class="fw-semibold">${model.name}</h6>
                    <div class="text-muted small mb-2">${model.framework} • ${model.size}</div>
                    <span class="tag w-fit">${model.tag}</span>
                </div>
            </div>
        `).join('');
    }

    if (tableBody) {
        tableBody.innerHTML = myModels.map(model => `
            <tr>
                <td class="ps-4"><div class="fw-bold">${model.name}</div><div class="text-muted small">${model.framework}</div></td>
                <td><span class="tag">${model.tag}</span></td>
                <td class="text-muted">${model.size}</td>
                <td class="text-muted">${model.date}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-light btn-sm rounded-3">Редактировать</button>
                    <button class="btn btn-light btn-sm rounded-3 text-danger" onclick="deleteModel(${model.id})">Удалить</button>
                </td>
            </tr>
        `).join('');
    }
}

function renderDatasets() {
    const dashboardContainer = document.querySelector("#dashboard-datasets-row");
    const tableBody = document.querySelector("#datasets-table-body");

    if (dashboardContainer) {
        dashboardContainer.innerHTML = myDatasets.map(ds => `
            <div class="col-md-4">
                <div class="card card-item p-3">
                    <h6 class="fw-semibold">${ds.name}</h6>
                    <div class="text-muted small mb-2">${ds.format} • ${ds.size}</div>
                    <span class="tag w-fit">${ds.tag}</span>
                </div>
            </div>
        `).join('');
    }

    if (tableBody) {
        tableBody.innerHTML = myDatasets.map(ds => `
            <tr>
                <td class="ps-4"><div class="fw-bold">${ds.name}</div><div class="text-muted small">${ds.format}</div></td>
                <td><span class="tag">${ds.tag}</span></td>
                <td class="text-muted">${ds.size}</td>
                <td class="text-muted">${ds.date}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-light btn-sm rounded-3">Редактировать</button>
                    <button class="btn btn-light btn-sm rounded-3 text-danger" onclick="deleteDataset(${ds.id})">Удалить</button>
                </td>
            </tr>
        `).join('');
    }
}

function renderSubscriptions() {
    const dashboardContainer = document.querySelector("#dashboard-subscriptions-row");
    const tableBody = document.querySelector("#subscriptions-table-body");

    if (dashboardContainer) {
        dashboardContainer.innerHTML = mySubscriptions.map(sub => `
            <div class="col-md-4">
                <div class="card card-item p-3">
                    <h6 class="fw-semibold">${sub.name}</h6>
                    <div class="text-muted small mb-2">${sub.type}</div>
                    <span class="tag w-fit">${sub.updates}</span>
                </div>
            </div>
        `).join('');
    }

    if (tableBody) {
        tableBody.innerHTML = mySubscriptions.map(sub => `
            <tr>
                <td class="ps-4"><div class="fw-bold">${sub.name}</div><div class="text-muted small">${sub.type}</div></td>
                <td><span class="tag">${sub.updates}</span></td>
                <td class="text-muted">Активна</td>
                <td class="text-muted">${sub.date}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-light btn-sm rounded-3">Настройки</button>
                    <button class="btn btn-light btn-sm rounded-3 text-danger" onclick="deleteSubscription(${sub.id})">Отписаться</button>
                </td>
            </tr>
        `).join('');
    }
}

function deleteModel(id) {
    if (confirm("Удалить модель?")) {
        const index = myModels.findIndex(m => m.id === id);
        if (index !== -1) { myModels.splice(index, 1); renderModels(); }
    }
}

function deleteDataset(id) {
    if (confirm("Удалить датасет?")) {
        const index = myDatasets.findIndex(d => d.id === id);
        if (index !== -1) { myDatasets.splice(index, 1); renderDatasets(); }
    }
}

function deleteSubscription(id) {
    if (confirm("Отписаться?")) {
        const index = mySubscriptions.findIndex(s => s.id === id);
        if (index !== -1) { mySubscriptions.splice(index, 1); renderSubscriptions(); }
    }
}

function loadSettings() {
    const nameInput = document.getElementById("userNameInput");
    const emailInput = document.getElementById("userEmailInput");
    const bioInput = document.getElementById("userBioInput");
    const notifyCheck = document.getElementById('notifyEmail');
    const avatarImg = document.getElementById('userAvatar');

    if (nameInput) nameInput.value = localStorage.getItem("userName") || "";
    if (emailInput) emailInput.value = localStorage.getItem("userEmail") || "";
    if (bioInput) bioInput.value = localStorage.getItem("userBio") || "";
    if (notifyCheck) notifyCheck.checked = localStorage.getItem("notifyEmail") === "true";
    if (avatarImg && localStorage.getItem("userAvatarBase64")) {
        avatarImg.src = localStorage.getItem("userAvatarBase64");
    }
}

function setupAvatarUpload() {
    const avatarInput = document.getElementById('avatarInput');
    const avatarImg = document.getElementById('userAvatar');
    if (!avatarInput || !avatarImg) return;

    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            try {
                localStorage.setItem("userAvatarBase64", reader.result);
                avatarImg.src = reader.result;
            } catch (err) {
                alert("Файл слишком велик");
            }
        };
    });
}

function handleSettingsSave() {
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (!saveBtn) return;

    saveBtn.addEventListener('click', () => {
        localStorage.setItem("userName", document.getElementById("userNameInput").value);
        localStorage.setItem("userEmail", document.getElementById("userEmailInput").value);
        localStorage.setItem("userBio", document.getElementById("userBioInput").value);
        localStorage.setItem("notifyEmail", document.getElementById('notifyEmail').checked);

        const originalText = saveBtn.innerText;
        saveBtn.innerText = "Сохранено!";
        saveBtn.classList.replace('btn-primary', 'btn-success');
        setTimeout(() => {
            saveBtn.innerText = originalText;
            saveBtn.classList.replace('btn-success', 'btn-primary');
        }, 1500);
    });
}

function deleteAccount() {
    if (confirm("Удалить аккаунт навсегда?")) {
        localStorage.clear();
        window.location.href = "login.html";
    }
}

function handleLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem("user");
            window.location.href = "login.html";
        });
    }
}

function fakeAuthCheck() {
    if (!localStorage.getItem("user") && !window.location.pathname.includes("login.html")) {
        window.location.href = "login.html";
    }
}

function setupUploadModal() {
    const btn = document.querySelector("#uploadModal .btn-primary");
    if (btn) btn.addEventListener("click", () => alert("Добавлено"));
}

const loginForm = document.querySelector('form');
if (loginForm && window.location.pathname.includes("login.html")) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        localStorage.setItem("user", "active");
        window.location.href = "dashboard.html";
    });
}