const API_URL = "http://localhost:3000";
const EXP_TO_SHOW_ON_MAIN_PAGE = 6;

document.addEventListener("DOMContentLoaded", async () => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
        window.location.href = "login.html";
        return;
    }

    const user = JSON.parse(userStr);
    const userNameElement = document.getElementById("userNameDisplay");
    if (userNameElement) userNameElement.innerText = user.name;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("currentUser");
            window.location.href = "login.html";
        });
    }

    if (window.location.pathname.includes("experiment_details.html")) {
        await loadExperimentDetails();
    } else {
        await fetchAndRenderDashboard();
    }

    const btnSave = document.getElementById("btnSaveExperiment");
    if (btnSave) {
        btnSave.addEventListener("click", createNewExperiment);
    }

    const btnSaveModel = document.getElementById("btnSaveModel");
    if (btnSaveModel) {
        btnSaveModel.addEventListener("click", createNewModel);
    }

    const btnDeleteProfile = document.getElementById("btnDeleteProfile");
    if (btnDeleteProfile) {
        btnDeleteProfile.addEventListener("click", deleteUserProfile);
    }
});

async function fetchAndRenderDashboard() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;

    try {
        const [expRes, modelsRes] = await Promise.all([
            axios.get(`${API_URL}/experiments?userId=${user.id}`),
            axios.get(`${API_URL}/models?userId=${user.id}`)
        ]);

        const models = modelsRes.data;
        const experiments = expRes.data;

        const searchTableBody = document.getElementById("searchTableBody");
        if (searchTableBody) {
            searchTableBody.innerHTML = "";
            experiments.slice().reverse().forEach(exp => {
                searchTableBody.innerHTML += `
                <tr>
                    <td><a href="experiment_details.html?id=${exp.id}" class="text-decoration-none text-truncate btn-min-width">${exp.name}</a></td>
                    <td><span class="badge bg-secondary text-truncate btn-min-width">${exp.model}</span></td>
                    <td>${exp.metricName}</td>
                    <td>${exp.metricValue}</td>
                    <td>${exp.date}</td>
                    <td>${exp.duration || "-"}</td>
                    <td><span class="badge ${exp.status === 'success' ? 'bg-success' : 'bg-warning text-dark'}">${exp.status}</span></td>
                    <td>
                        <button class="btn btn-sm text-danger" onclick="deleteExp('${exp.id}')">🗑</button>
                    </td>
                </tr>
            `;
            });
        }

        const statExp = document.getElementById("stat-experiments");
        const statMod = document.getElementById("stat-models");
        const tableBody = document.getElementById("experimentsTableBody");

        if (statExp) statExp.innerText = experiments.length;
        if (statMod) statMod.innerText = models.length;

        if (tableBody) {
            tableBody.innerHTML = "";
            experiments.slice().reverse().slice(0, EXP_TO_SHOW_ON_MAIN_PAGE).forEach(exp => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                <td><a href="experiment_details.html?id=${exp.id}" class="text-decoration-none text-truncate btn-min-width">${exp.name}</a></td>
                <td><span class="badge bg-secondary text-truncate btn-min-width">${exp.model}</span></td>
                <td>${exp.metricName || 'Accuracy'}</td>
                <td>${exp.metricValue || '0'}</td>
                <td>${exp.date}</td>
                <td>${exp.duration || "-"}</td>
                <td><span class="badge ${exp.status === 'success' ? 'bg-success' : 'bg-warning text-dark'}">${exp.status}</span></td>
                <td>
                    <button class="btn btn-sm text-danger" aria-label="Удалить эксперимент" onclick="deleteExp('${exp.id}')">🗑</button>
                </td>
            `;
                tableBody.appendChild(tr);
            });
        }

        const modelsContainer = document.getElementById("modelsContainer");
        if (modelsContainer) {
            modelsContainer.innerHTML = "";
            models.forEach((model, index) => {
                const versions = experiments.filter(e => e.model === model.name);
                const card = document.createElement("div");
                card.className = "card mb-3 shadow-sm border-0 overflow-hidden";
                card.innerHTML = `
                    <div class="card-header bg-white d-flex justify-content-between align-items-center">
                        <div>
                            <div class="d-flex align-items-center gap-2">
                                <h5 class="mb-0 text-primary">${model.name}</h5>
                                <button class="btn btn-sm text-danger p-0 border-0" title="Удалить модель" aria-label="Удалить модель" onclick="deleteModel('${model.id}')">🗑</button>
                            </div>
                            <small class="text-muted">Последнее обновление: ${model.date || 'Неизвестно'}</small>
                        </div>
                        <button class="btn btn-outline-secondary btn-sm collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#model${index}">
                            Показать версии
                        </button>
                    </div>
                    <div class="collapse" id="model${index}">
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-striped align-middle mb-0">
                                    <thead class="table-light">
                                        <tr>
                                            <th class="col-version ps-4">Версия</th>
                                            <th class="col-stage">Стадия</th>
                                            <th class="col-metrics">Метрики</th>
                                            <th class="col-action">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${versions.length > 0 ? versions.map(v => `
                                            <tr>
                                                <td class="ps-4"><div class="table-truncate">v${v.id}</div></td>
                                                <td><span class="badge ${v.status === 'success' ? 'bg-success' : 'bg-warning text-dark'}">${v.status}</span></td>
                                                <td>Acc: ${v.metricValue}</td>
                                                <td><a href="experiment_details.html?id=${v.id}" class="text-decoration-none">Детали</a></td>
                                            </tr>
                                        `).join('') : '<tr><td colspan="4" class="text-center p-3 text-muted">Версии не найдены</td></tr>'}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
                modelsContainer.appendChild(card);
            });
        }

    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
    }
}

async function createNewModel() {
    const nameInput = document.getElementById("newModelName");
    const frameworkInput = document.getElementById("newModelFramework");
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!nameInput || !nameInput.value.trim()) {
        alert("Заполните название модели!");
        return;
    }

    const newModel = {
        name: nameInput.value.trim(),
        framework: frameworkInput ? frameworkInput.value : "unknown",
        date: new Date().toLocaleDateString(),
        userId: user.id
    };

    try {
        await axios.post(`${API_URL}/models`, newModel);
        bootstrap.Modal.getInstance(document.getElementById('registerModelModal')).hide();
        nameInput.value = "";
        alert("Модель успешно зарегистрирована!");
        await fetchAndRenderDashboard();
    } catch (error) {
        console.error("Ошибка API:", error);
    }
}

async function createNewExperiment() {
    const nameInput = document.getElementById("newExpName");
    const modelInput = document.getElementById("newExpModel");
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!nameInput || !modelInput) return;

    const name = nameInput.value.trim();
    const modelName = modelInput.value.trim();

    if (!name || !modelName) {
        alert("Заполните название и модель!");
        return;
    }

    try {
        const [expRes, modelsRes] = await Promise.all([
            axios.get(`${API_URL}/experiments?userId=${user.id}`),
            axios.get(`${API_URL}/models?userId=${user.id}`)
        ]);

        const userExp = expRes.data.filter(e => String(e.userId) === String(user.id));
        const userModels = modelsRes.data.filter(m => String(m.userId) === String(user.id));

        const isDuplicate = userExp.some(e => e.name.toLowerCase() === name.toLowerCase());
        if (isDuplicate) {
            alert("Эксперимент с таким названием уже существует!");
            return;
        }

        const modelExists = userModels.some(m => m.name === modelName);
        if (!modelExists) {
            alert(`Модель "${modelName}" не найдена в реестре! Проверьте правильность написания.`);
            return;
        }

        const newExp = {
            name: name,
            model: modelName,
            metricName: "Accuracy",
            metricValue: (Math.random() * 100).toFixed(2),
            date: new Date().toLocaleDateString(),
            duration: "0 min",
            status: "process",
            userId: user.id
        };

        await axios.post(`${API_URL}/experiments`, newExp);
        bootstrap.Modal.getInstance(document.getElementById('newExperimentModal')).hide();
        nameInput.value = "";
        modelInput.value = "";
        await fetchAndRenderDashboard();

    } catch (e) {
        console.error("Ошибка:", e);
    }
}

async function deleteUserProfile() {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) return;
    const user = JSON.parse(userStr);

    if (!confirm("ВНИМАНИЕ! Это необратимое действие. Удалить профиль и все данные?")) return;

    try {
        const [expRes, modelsRes] = await Promise.all([
            axios.get(`${API_URL}/experiments?userId=${user.id}`),
            axios.get(`${API_URL}/models?userId=${user.id}`)
        ]);

        const deletePromises = [
            ...modelsRes.data.map(m => axios.delete(`${API_URL}/models/${m.id}`)),
            ...expRes.data.map(e => axios.delete(`${API_URL}/experiments/${e.id}`))
        ];

        await Promise.all(deletePromises);
        await axios.delete(`${API_URL}/users/${user.id}`);
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    } catch (e) {
        console.error("Ошибка удаления:", e);
        alert("Не удалось удалить профиль.");
    }
}

window.deleteExp = async function(id) {
    if (confirm("Удалить запись?")) {
        try {
            await axios.delete(`${API_URL}/experiments/${id}`);
            await fetchAndRenderDashboard();
        } catch (error) {
            console.error("Ошибка API", error);
        }
    }
}

window.deleteModel = async function(id) {
    if (confirm("Вы уверены, что хотите удалить эту модель?")) {
        try {
            await axios.delete(`${API_URL}/models/${id}`);
            await fetchAndRenderDashboard();
        } catch (e) {
            console.error("Ошибка удаления модели:", e);
            alert("Не удалось удалить модель.");
        }
    }
}

async function loadExperimentDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const expId = urlParams.get('id');

    if (!expId) {
        alert("Эксперимент не найден!");
        window.location.href = "search_page.html";
        return;
    }

    try {
        const response = await axios.get(`${API_URL}/experiments/${expId}`);
        const exp = response.data;

        document.getElementById("detailExpName").innerText = exp.name;
        document.getElementById("detailExpDate").innerText = `Запущен: ${exp.date}`;

        const statusBadge = document.getElementById("detailExpStatus");
        statusBadge.innerText = exp.status;
        if (exp.status === "success") {
            statusBadge.className = "badge bg-success fs-5";
        } else {
            statusBadge.className = "badge bg-warning text-dark fs-5";
        }

        document.getElementById("detailExpMetricName").innerText = exp.metricName || "Метрика";
        document.getElementById("detailExpMetricValue").innerText = exp.metricValue || "-";
        document.getElementById("detailExpModelName").innerText = exp.model || "-";
        document.getElementById("detailExpDuration").innerText = exp.duration || "-";

    } catch (error) {
        console.error("Ошибка загрузки деталей:", error);
        alert("Не удалось загрузить данные эксперимента.");
        window.location.href = "search_page.html";
    }
}

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

const themeSwitch = document.getElementById('darkModeSwitch');
if (themeSwitch) {
    themeSwitch.checked = (savedTheme === 'dark');
    themeSwitch.addEventListener('change', () => {
        const newTheme = themeSwitch.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}