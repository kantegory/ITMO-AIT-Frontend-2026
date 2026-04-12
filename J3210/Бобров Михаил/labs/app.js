const myModels = [
    {
        id: 1,
        name: "Image Classifier Pro",
        framework: "PyTorch",
        size: "120MB",
        tag: "CV",
        date: "12.05.2024",
        author: "Vision Team",
        description: "Высокоточная сверточная нейронная сеть для классификации объектов. Обучена на наборе данных ImageNet-1K. Поддерживает 1000 категорий объектов и оптимизирована для мобильных устройств.",
        version: "2.4.0-stable"
    },
    {
        id: 2,
        name: "NLP Sentiment Analysis",
        framework: "Transformers",
        size: "450MB",
        tag: "NLP",
        date: "10.05.2024",
        author: "TextAI Group",
        description: "Модель на базе архитектуры BERT для анализа тональности текста на русском и английском языках. Идеально подходит для мониторинга соцсетей и отзывов.",
        version: "1.0.2"
    },
    {
        id: 3,
        name: "Stock Predictor",
        framework: "Scikit-learn",
        size: "15MB",
        tag: "Finance",
        date: "08.05.2024",
        author: "Quant Solutions",
        description: "Регрессионная модель для краткосрочного прогнозирования цен акций. Использует исторические данные и технические индикаторы.",
        version: "0.9.5-beta"
    }
];

const myDatasets = [
    { id: 1, name: "Cats vs Dogs HD", format: "Images (JPG)", size: "2.1GB", tag: "Vision", date: "11.05.2024" },
    { id: 2, name: "Russian Wiki Text", format: "JSONL", size: "850MB", tag: "NLP", date: "09.05.2024" },
    { id: 3, name: "Customer Churn CSV", format: "CSV", size: "12MB", tag: "Tabular", date: "05.05.2024" }
];

const mySubscriptions = [
    { id: 1, name: "NLP Research Group", type: "Community", updates: "5 новых моделей", date: "12.04.2026" },
    { id: 2, name: "Visionary AI", type: "Author", updates: "1 датасет", date: "10.04.2026" }
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
    loadModelDetails();
});

function renderModels() {
    const dashboardContainer = document.querySelector("#dashboard-models-row");
    const tableBody = document.querySelector("#models-table-body");

    if (dashboardContainer) {
        dashboardContainer.innerHTML = myModels.map(model => `
            <div class="col-md-4">
                <div class="card card-item p-3">
                    <h6 class="fw-semibold"><a href="model-details.html?id=${model.id}" class="text-decoration-none text-dark">${model.name}</a></h6>
                    <div class="text-muted small mb-2">${model.framework} • ${model.size}</div>
                    <span class="tag w-fit">${model.tag}</span>
                </div>
            </div>
        `).join('');
    }

    if (tableBody) {
        tableBody.innerHTML = myModels.map(model => `
            <tr>
                <td class="ps-4">
                    <div class="fw-bold"><a href="model-details.html?id=${model.id}" class="text-decoration-none text-dark">${model.name}</a></div>
                    <div class="text-muted small">${model.framework}</div>
                </td>
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

function loadModelDetails() {
    const params = new URLSearchParams(window.location.search);
    const modelId = parseInt(params.get('id'));
    if (!modelId || !window.location.pathname.includes('model-details.html')) return;

    const model = myModels.find(m => m.id === modelId);
    if (model) {
        document.getElementById('modelTitle').innerText = model.name;
        document.getElementById('modelFramework').innerText = model.framework;
        document.getElementById('modelSize').innerText = model.size;
        document.getElementById('modelTag').innerText = model.tag;
        document.getElementById('modelAuthor').innerText = model.author;
        document.getElementById('modelVersion').innerText = model.version;
        document.getElementById('modelDate').innerText = model.date;
        document.getElementById('modelDescription').innerText = model.description;
        document.getElementById('modelSlug').innerText = model.name.toLowerCase().replace(/\s+/g, '-');
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
    const dashboardContainer = document.querySelector("#dashboard-subs-row");
    const tableBody = document.querySelector("#subs-table-body");
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

function loadSettings() {
    const avatarImg = document.getElementById('userAvatar');
    if (document.getElementById("userNameInput")) {
        document.getElementById("userNameInput").value = localStorage.getItem("userName") || "";
        document.getElementById("userEmailInput").value = localStorage.getItem("userEmail") || "";
        document.getElementById("userBioInput").value = localStorage.getItem("userBio") || "";
        document.getElementById('notifyEmail').checked = localStorage.getItem("notifyEmail") === "true";
        if (avatarImg && localStorage.getItem("userAvatarBase64")) avatarImg.src = localStorage.getItem("userAvatarBase64");
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
            localStorage.setItem("userAvatarBase64", reader.result);
            avatarImg.src = reader.result;
        };
    });
}

function handleSettingsSave() {
    const btn = document.getElementById('saveSettingsBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            localStorage.setItem("userName", document.getElementById("userNameInput").value);
            localStorage.setItem("userEmail", document.getElementById("userEmailInput").value);
            localStorage.setItem("userBio", document.getElementById("userBioInput").value);
            localStorage.setItem("notifyEmail", document.getElementById('notifyEmail').checked);
            btn.innerText = "Сохранено!";
            setTimeout(() => btn.innerText = "Сохранить", 1500);
        });
    }
}

function handleLogout() {
    const btn = document.getElementById('logoutBtn');
    if (btn) btn.addEventListener('click', () => { localStorage.removeItem("user"); window.location.href = "login.html"; });
}

function fakeAuthCheck() {
    if (!localStorage.getItem("user") && !window.location.pathname.includes("login.html")) window.location.href = "login.html";
}

function setupUploadModal() {
    const btn = document.querySelector("#uploadModal .btn-primary");
    if (btn) btn.addEventListener("click", () => alert("Добавлено"));
}