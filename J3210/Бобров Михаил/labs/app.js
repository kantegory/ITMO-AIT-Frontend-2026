const myModels = [
    { id: 1, name: "Image Classifier Pro", framework: "PyTorch", size: "120MB", tag: "CV", date: "12.05.2024" },
    { id: 2, name: "NLP Sentiment Analysis", framework: "Transformers", size: "450MB", tag: "NLP", date: "10.05.2024" },
    { id: 3, name: "Stock Predictor", framework: "Scikit-learn", size: "15MB", tag: "Finance", date: "08.05.2024" },
    { id: 4, name: "Voice Recognizer", framework: "TensorFlow", size: "800MB", tag: "Audio", date: "01.05.2024" }
];

const myDatasets = [
    { id: 1, name: "Cats vs Dogs HD", format: "Images (JPG)", size: "2.1GB", tag: "Vision", date: "11.05.2024" },
    { id: 2, name: "Russian Wiki Text", format: "JSONL", size: "850MB", tag: "NLP", date: "09.05.2024" },
    { id: 3, name: "Customer Churn CSV", format: "CSV", size: "12MB", tag: "Tabular", date: "05.05.2024" },
];

document.addEventListener("DOMContentLoaded", () => {
    console.log("DataPort app loaded");
    handleLogout();
    setupUploadModal();
    fakeAuthCheck();
    renderModels();
    renderDatasets();
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
                <td class="ps-4">
                    <div class="fw-bold">${model.name}</div>
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

function deleteModel(id) {
    if (confirm("Вы уверены, что хотите удалить эту модель?")) {
        const index = myModels.findIndex(m => m.id === id);
        if (index !== -1) {
            myModels.splice(index, 1);
            renderModels();
        }
    }
}

function deleteDataset(id) {
    if (confirm("Вы уверены, что хотите удалить этот датасет?")) {
        const index = myDatasets.findIndex(d => d.id === id);
        if (index !== -1) {
            myDatasets.splice(index, 1);
            renderDatasets();
        }
    }
}

function setupUploadModal() {
    const uploadBtn = document.querySelector("#uploadModal .btn-primary");
    if (uploadBtn) {
        uploadBtn.addEventListener("click", () => {
            alert("Модель добавлена в список");
        });
    }
}

function fakeAuthCheck() {
    const isLoggedIn = localStorage.getItem("user");

    if (!isLoggedIn && window.location.pathname.includes("dashboard")) {
        window.location.href = "login.html";
    }
}

const loginForm = document.querySelector('form');
if (loginForm && window.location.pathname.includes("login.html")) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        localStorage.setItem("user", "active");
        window.location.href = "dashboard.html";
    });
}

function handleLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("user");
        window.location.href = "login.html";
    });
}