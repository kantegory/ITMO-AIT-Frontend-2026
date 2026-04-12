const myModels = [
    { id: 1, name: "Image Classifier Pro", framework: "PyTorch", size: "120MB", tag: "CV", date: "12.05.2024", author: "Vision Team", description: "Высокоточная сверточная нейронная сеть для классификации объектов.", version: "2.4.0-stable" },
    { id: 2, name: "NLP Sentiment Analysis", framework: "Transformers", size: "450MB", tag: "NLP", date: "10.05.2024", author: "TextAI Group", description: "Модель на базе архитектуры BERT для анализа тональности текста.", version: "1.0.2" },
    { id: 3, name: "Stock Predictor", framework: "Scikit-learn", size: "15MB", tag: "Finance", date: "08.05.2024", author: "Quant Solutions", description: "Регрессионная модель для прогнозирования цен акций.", version: "0.9.5-beta" }
];

const myDatasets = [
    { id: 1, name: "Cats vs Dogs HD", format: "Images (JPG)", size: "2.1GB", tag: "Vision", date: "11.05.2024", rows: "25,000", description: "Набор фото кошек и собак для бинарной классификации." },
    { id: 2, name: "Russian Wiki Text", format: "JSONL", size: "850MB", tag: "NLP", date: "09.05.2024", rows: "1.2 млн", description: "Чистый текстовый корпус из русской Википедии." },
    { id: 3, name: "Customer Churn CSV", format: "CSV", size: "12MB", tag: "Tabular", date: "05.05.2024", rows: "100,000", description: "Данные о поведении клиентов для прогнозирования оттока." }
];

const mySubscriptions = [
    { id: 1, name: "NLP Research Group", type: "Community", updates: "5 новых моделей", date: "12.04.2026", members: "12,405", releases: "142", description: "Ведущее сообщество по разработке и оптимизации языковых моделей для русского языка." },
    { id: 2, name: "Visionary AI", type: "Author", updates: "1 датасет", date: "10.04.2026", members: "3,120", releases: "28", description: "Независимый исследователь в области компьютерного зрения и генеративных сетей." }
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
    loadDatasetDetails();
    loadSubscriptionDetails();
});

function renderModels() {
    const dash = document.querySelector("#dashboard-models-row");
    const table = document.querySelector("#models-table-body");
    if (dash) {
        dash.innerHTML = myModels.map(m => `
            <div class="col-md-4"><div class="card card-item p-3">
                <h6 class="fw-semibold"><a href="model-details.html?id=${m.id}" class="text-decoration-none text-dark">${m.name}</a></h6>
                <div class="text-muted small mb-2">${m.framework} • ${m.size}</div>
                <span class="tag w-fit">${m.tag}</span>
            </div></div>`).join('');
    }
    if (table) {
        table.innerHTML = myModels.map(m => `
            <tr>
                <td class="ps-4"><div class="fw-bold"><a href="model-details.html?id=${m.id}" class="text-decoration-none text-dark">${m.name}</a></div><div class="text-muted small">${m.framework}</div></td>
                <td><span class="tag">${m.tag}</span></td><td class="text-muted">${m.size}</td><td class="text-muted">${m.date}</td>
                <td class="text-end pe-4"><button class="btn btn-light btn-sm rounded-3 text-danger" onclick="deleteModel(${m.id})">Удалить</button></td>
            </tr>`).join('');
    }
}

function renderDatasets() {
    const dash = document.querySelector("#dashboard-datasets-row");
    const table = document.querySelector("#datasets-table-body");
    if (dash) {
        dash.innerHTML = myDatasets.map(d => `
            <div class="col-md-4"><div class="card card-item p-3">
                <h6 class="fw-semibold"><a href="dataset-details.html?id=${d.id}" class="text-decoration-none text-dark">${d.name}</a></h6>
                <div class="text-muted small mb-2">${d.format} • ${d.size}</div>
                <span class="tag w-fit">${d.tag}</span>
            </div></div>`).join('');
    }
    if (table) {
        table.innerHTML = myDatasets.map(d => `
            <tr>
                <td class="ps-4"><div class="fw-bold"><a href="dataset-details.html?id=${d.id}" class="text-decoration-none text-dark">${d.name}</a></div><div class="text-muted small">${d.format}</div></td>
                <td><span class="tag">${d.tag}</span></td><td class="text-muted">${d.size}</td><td class="text-muted">${d.date}</td>
                <td class="text-end pe-4"><button class="btn btn-light btn-sm rounded-3 text-danger" onclick="deleteDataset(${d.id})">Удалить</button></td>
            </tr>`).join('');
    }
}

function renderSubscriptions() {
    const dash = document.querySelector("#dashboard-subs-row");
    const table = document.querySelector("#subs-table-body");
    if (dash) {
        dash.innerHTML = mySubscriptions.map(s => `
            <div class="col-md-4"><div class="card card-item p-3">
                <h6 class="fw-semibold"><a href="subscription-details.html?id=${s.id}" class="text-decoration-none text-dark">${s.name}</a></h6>
                <div class="text-muted small mb-2">${s.type}</div>
                <span class="tag w-fit">${s.updates}</span>
            </div></div>`).join('');
    }
    if (table) {
        table.innerHTML = mySubscriptions.map(s => `
            <tr>
                <td class="ps-4"><div class="fw-bold"><a href="subscription-details.html?id=${s.id}" class="text-decoration-none text-dark">${s.name}</a></div><div class="text-muted small">${s.type}</div></td>
                <td><span class="tag">${s.updates}</span></td><td class="text-muted">Активна</td><td class="text-muted">${s.date}</td>
                <td class="text-end pe-4"><button class="btn btn-light btn-sm rounded-3 text-danger" onclick="deleteSubscription(${s.id})">Отписаться</button></td>
            </tr>`).join('');
    }
}

function loadModelDetails() {
    const p = new URLSearchParams(window.location.search);
    const id = parseInt(p.get('id'));
    if (!id || !window.location.pathname.includes('model-details.html')) return;
    const m = myModels.find(x => x.id === id);
    if (m) {
        document.getElementById('modelTitle').innerText = m.name;
        document.getElementById('modelFramework').innerText = m.framework;
        document.getElementById('modelSize').innerText = m.size;
        document.getElementById('modelTag').innerText = m.tag;
        document.getElementById('modelAuthor').innerText = m.author;
        document.getElementById('modelVersion').innerText = m.version;
        document.getElementById('modelDate').innerText = m.date;
        document.getElementById('modelDescription').innerText = m.description;
        document.getElementById('modelSlug').innerText = m.name.toLowerCase().replace(/\s+/g, '-');
    }
}

function loadDatasetDetails() {
    const p = new URLSearchParams(window.location.search);
    const id = parseInt(p.get('id'));
    if (!id || !window.location.pathname.includes('dataset-details.html')) return;
    const d = myDatasets.find(x => x.id === id);
    if (d) {
        document.getElementById('dsTitle').innerText = d.name;
        document.getElementById('dsFormat').innerText = d.format;
        document.getElementById('dsSize').innerText = d.size;
        document.getElementById('dsRows').innerText = d.rows;
        document.getElementById('dsTag').innerText = d.tag;
        document.getElementById('dsDate').innerText = d.date;
        document.getElementById('dsDescription').innerText = d.description;
    }
}

function loadSubscriptionDetails() {
    const p = new URLSearchParams(window.location.search);
    const id = parseInt(p.get('id'));
    if (!id || !window.location.pathname.includes('subscription-details.html')) return;
    const s = mySubscriptions.find(x => x.id === id);
    if (s) {
        document.getElementById('subTitle').innerText = s.name;
        document.getElementById('subNameDisplay').innerText = s.name;
        document.getElementById('subTypeDisplay').innerText = s.type;
        document.getElementById('subMembers').innerText = s.members;
        document.getElementById('subReleases').innerText = s.releases;
        document.getElementById('subDescription').innerText = s.description;
    }
}

function deleteModel(id) { if (confirm("Удалить модель?")) { const i = myModels.findIndex(x => x.id === id); if (i !== -1) { myModels.splice(i, 1); renderModels(); } } }
function deleteDataset(id) { if (confirm("Удалить датасет?")) { const i = myDatasets.findIndex(x => x.id === id); if (i !== -1) { myDatasets.splice(i, 1); renderDatasets(); } } }
function deleteSubscription(id) { if (confirm("Отписаться?")) { const i = mySubscriptions.findIndex(x => x.id === id); if (i !== -1) { mySubscriptions.splice(i, 1); renderSubscriptions(); } } }

function deleteSubscriptionFromDetails() {
    const id = parseInt(new URLSearchParams(window.location.search).get('id'));
    if (confirm("Отписаться от этого сообщества?")) {
        const i = mySubscriptions.findIndex(x => x.id === id);
        if (i !== -1) { mySubscriptions.splice(i, 1); window.location.href = "my-subscriptions.html"; }
    }
}

function deleteAccount() { if (confirm("Удалить аккаунт навсегда?")) { localStorage.clear(); window.location.href = "login.html"; } }

function loadSettings() {
    if (!document.getElementById("userNameInput")) return;
    document.getElementById("userNameInput").value = localStorage.getItem("userName") || "";
    document.getElementById("userEmailInput").value = localStorage.getItem("userEmail") || "";
    document.getElementById("userBioInput").value = localStorage.getItem("userBio") || "";
    document.getElementById('notifyEmail').checked = localStorage.getItem("notifyEmail") === "true";
    const img = localStorage.getItem("userAvatarBase64");
    if (img && document.getElementById('userAvatar')) document.getElementById('userAvatar').src = img;
}

function setupAvatarUpload() {
    const inp = document.getElementById('avatarInput');
    const img = document.getElementById('userAvatar');
    if (!inp || !img) return;
    inp.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => { localStorage.setItem("userAvatarBase64", reader.result); img.src = reader.result; };
    });
}

function handleSettingsSave() {
    const btn = document.getElementById('saveSettingsBtn');
    if (btn) btn.addEventListener('click', () => {
        localStorage.setItem("userName", document.getElementById("userNameInput").value);
        localStorage.setItem("userEmail", document.getElementById("userEmailInput").value);
        localStorage.setItem("userBio", document.getElementById("userBioInput").value);
        localStorage.setItem("notifyEmail", document.getElementById('notifyEmail').checked);
        btn.innerText = "Сохранено!"; setTimeout(() => btn.innerText = "Сохранить", 1500);
    });
}

function handleLogout() {
    const btn = document.getElementById('logoutBtn');
    if (btn) btn.addEventListener('click', () => { localStorage.removeItem("user"); window.location.href = "login.html"; });
}

function fakeAuthCheck() { if (!localStorage.getItem("user") && !window.location.pathname.includes("login.html")) window.location.href = "login.html"; }
function setupUploadModal() { const btn = document.querySelector("#uploadModal .btn-primary"); if (btn) btn.addEventListener("click", () => alert("Добавлено")); }