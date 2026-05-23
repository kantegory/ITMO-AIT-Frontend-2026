const API_URL = ["http:", "", "localhost:3000"].join("/");

let myModels = [];
let myDatasets = [];
let mySubscriptions = [];
let globalModels = [];
let globalDatasets = [];

document.addEventListener("DOMContentLoaded", async () => {
    setupAuthForms();
    if (!fakeAuthCheck()) return;

    await loadApiData();
    handleLogout();
    renderModels();
    renderDatasets();
    renderSubscriptions();
    loadSettings();
    handleSettingsSave();
    setupAvatarUpload();
    loadModelDetails();
    loadDatasetDetails();
    loadSubscriptionDetails();
    renderExplore();
    setupGlobalSearch();
    setupUploadModal();
});

async function api(path, options = {}) {
    const params = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    };

    if (params.body && typeof params.body !== "string") {
        params.body = JSON.stringify(params.body);
    }

    const response = await fetch(`${API_URL}${path}`, params);
    if (!response.ok) throw new Error("API request failed");
    return response.status === 204 ? null : response.json();
}

async function loadApiData() {
    try {
        [myModels, myDatasets, mySubscriptions, globalModels, globalDatasets] = await Promise.all([
            api("/myModels"),
            api("/myDatasets"),
            api("/mySubscriptions"),
            api("/globalModels"),
            api("/globalDatasets")
        ]);
    } catch (error) {
        alert("Не удалось подключиться к моковому API. Запустите npm run api");
    }
}

function fakeAuthCheck() {
    const isAuthPage = window.location.pathname.includes("login.html") || window.location.pathname.includes("register.html");
    if (!localStorage.getItem("user") && !isAuthPage) {
        window.location.href = "login.html";
        return false;
    }
    return true;
}

function setupAuthForms() {
    const loginForm = document.querySelector("title")?.innerText.includes("Вход") ? document.querySelector("form") : null;
    const registerForm = document.querySelector("title")?.innerText.includes("Регистрация") ? document.querySelector("form") : null;

    if (loginForm) {
        loginForm.onsubmit = async (event) => {
            event.preventDefault();
            const email = loginForm.querySelector('input[type="email"]')?.value.trim();
            const password = loginForm.querySelector('input[type="password"]')?.value;
            const users = await api(`/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
            const user = users[0];

            if (!user) {
                alert("Неверный email или пароль");
                return;
            }

            localStorage.setItem("user", String(user.id));
            localStorage.setItem("userName", user.name);
            localStorage.setItem("userEmail", user.email);
            window.location.href = "dashboard.html";
        };
    }

    if (registerForm) {
        registerForm.onsubmit = async (event) => {
            event.preventDefault();
            const inputs = registerForm.querySelectorAll("input");
            const name = inputs[0]?.value.trim() || "";
            const email = registerForm.querySelector('input[type="email"]')?.value.trim() || "";
            const passwords = registerForm.querySelectorAll('input[type="password"]');

            if (passwords[0]?.value !== passwords[1]?.value) {
                alert("Пароли не совпадают");
                return;
            }

            const existingUsers = await api(`/users?email=${encodeURIComponent(email)}`);
            if (existingUsers.length) {
                alert("Пользователь с таким email уже существует");
                return;
            }

            const user = await api("/users", {
                method: "POST",
                body: {
                    name,
                    email,
                    password: passwords[0]?.value
                }
            });

            localStorage.setItem("user", String(user.id));
            localStorage.setItem("userName", user.name);
            localStorage.setItem("userEmail", user.email);
            window.location.href = "dashboard.html";
        };
    }
}

function handleLogout() {
    const btn = document.getElementById("logoutBtn");
    if (btn) btn.onclick = () => {
        localStorage.removeItem("user");
        window.location.href = "login.html";
    };
}

async function socialAction(type, category = "model") {
    const prefix = category === "model" ? "model" : "ds";
    const idName = type === "like" ? prefix + "Likes" : prefix + "Forks";
    const countEl = document.getElementById(idName);
    const id = parseInt(new URLSearchParams(window.location.search).get("id"));
    const collections = category === "model"
        ? [{ list: myModels, path: "myModels" }, { list: globalModels, path: "globalModels" }]
        : [{ list: myDatasets, path: "myDatasets" }, { list: globalDatasets, path: "globalDatasets" }];
    const collection = collections.find(item => item.list.some(entry => entry.id === id));
    const entity = collection?.list.find(entry => entry.id === id);

    if (countEl && entity) {
        const field = type === "like" ? "likes" : "forks";
        entity[field] = (entity[field] || 0) + 1;
        countEl.innerText = entity[field];
        await api(`/${collection.path}/${id}`, {
            method: "PATCH",
            body: { [field]: entity[field] }
        });
        const btn = event.currentTarget;
        btn.classList.remove("btn-outline-primary", "btn-outline-secondary");
        btn.classList.add(type === "like" ? "btn-primary" : "btn-secondary");
    }
}

async function addComment() {
    const input = document.getElementById("commentInput");
    const list = document.getElementById("commentsList");
    if (!input || !input.value.trim()) return;

    const user = localStorage.getItem("userName") || "Пользователь";
    const comment = await api("/comments", {
        method: "POST",
        body: {
            user,
            text: input.value,
            page: window.location.pathname,
            resourceId: new URLSearchParams(window.location.search).get("id"),
            createdAt: new Date().toISOString()
        }
    });
    const commentHtml = `
        <div class="p-3 bg-light rounded-4 mb-3 shadow-sm" style="border-left: 4px solid #0d6efd;">
            <div class="fw-bold small mb-1">${comment.user} <span class="text-muted fw-normal ms-2">Только что</span></div>
            <div class="small text-dark">${comment.text}</div>
        </div>`;

    list.insertAdjacentHTML("afterbegin", commentHtml);
    input.value = "";
}

function renderExplore() {
    const mRow = document.querySelector("#explore-models-row");
    const dRow = document.querySelector("#explore-datasets-row");
    if (!mRow && !dRow) return;

    const searchVal = document.getElementById("globalSearch")?.value.toLowerCase() || "";
    const tagVal = document.getElementById("filterTag")?.value || "";
    const frameVal = document.getElementById("filterFramework")?.value || "";
    const licVal = document.getElementById("filterLicense")?.value || "";

    const fModels = globalModels.filter(m => {
        return (m.name.toLowerCase().includes(searchVal)) &&
            (tagVal === "" || m.tag === tagVal) &&
            (frameVal === "" || m.framework === frameVal) &&
            (licVal === "" || m.license === licVal);
    });

    const fDatasets = globalDatasets.filter(d => {
        return (d.name.toLowerCase().includes(searchVal)) &&
            (tagVal === "" || d.tag === tagVal) &&
            (licVal === "" || (d.license && d.license.includes(licVal)));
    });

    if (mRow) {
        mRow.innerHTML = fModels.map(m => `
            <div class="col-md-6 col-lg-4">
                <div class="card card-item p-3 h-100 border-0 shadow-sm">
                    <h6 class="fw-bold"><a href="model-details.html?id=${m.id}" class="text-dark text-decoration-none">${m.name}</a></h6>
                    <div class="text-muted small mb-2">${m.framework} • ${m.license}</div>
                    <p class="text-muted small mb-3">${m.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <span class="tag">${m.tag}</span>
                        <button class="btn btn-primary btn-sm" onclick="addToMy('models', ${m.id})">Добавить</button>
                    </div>
                </div>
            </div>`).join("") || '<p class="text-muted p-3">Модели не найдены</p>';
    }

    if (dRow) {
        dRow.innerHTML = fDatasets.map(d => `
            <div class="col-md-6 col-lg-4">
                <div class="card card-item p-3 h-100 border-0 shadow-sm">
                    <h6 class="fw-bold"><a href="dataset-details.html?id=${d.id}" class="text-dark text-decoration-none">${d.name}</a></h6>
                    <div class="text-muted small mb-2">${d.size} • ${d.license}</div>
                    <p class="text-muted small mb-3">${d.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <span class="tag">${d.tag}</span>
                        <button class="btn btn-primary btn-sm" onclick="addToMy('datasets', ${d.id})">Добавить</button>
                    </div>
                </div>
            </div>`).join("") || '<p class="text-muted p-3">Датасеты не найдены</p>';
    }
}

function setupGlobalSearch() {
    const inputs = document.querySelectorAll(".filter-input, #globalSearch");
    inputs.forEach(input => input.addEventListener("input", renderExplore));

    const resetBtn = document.getElementById("resetFilters");
    if (resetBtn) {
        resetBtn.onclick = () => {
            document.querySelectorAll(".filter-input").forEach(i => i.value = "");
            if (document.getElementById("globalSearch")) document.getElementById("globalSearch").value = "";
            renderExplore();
        };
    }
}

function loadModelDetails() {
    const p = new URLSearchParams(window.location.search);
    const id = parseInt(p.get("id"));
    if (!id || !window.location.pathname.includes("model-details.html")) return;
    const m = [...myModels, ...globalModels].find(x => x.id === id);
    if (m) {
        document.getElementById("modelTitle").innerText = m.name;
        document.getElementById("modelDescription").innerText = m.description;
        document.getElementById("modelAuthor").innerText = m.author;
        document.getElementById("modelFramework").innerText = m.framework || "N/A";
        document.getElementById("modelSize").innerText = m.size;
        document.getElementById("modelTag").innerText = m.tag;
        document.getElementById("modelLikes").innerText = m.likes || 0;
        document.getElementById("modelForks").innerText = m.forks || 0;
        document.getElementById("modelSlug").innerText = m.name.toLowerCase().replace(/\s+/g, "-");
    }
}

function loadDatasetDetails() {
    const p = new URLSearchParams(window.location.search);
    const id = parseInt(p.get("id"));
    if (!id || !window.location.pathname.includes("dataset-details.html")) return;
    const d = [...myDatasets, ...globalDatasets].find(x => x.id === id);
    if (d) {
        document.getElementById("dsTitle").innerText = d.name;
        document.getElementById("dsDescription").innerText = d.description;
        document.getElementById("dsRows").innerText = d.rows || "N/A";
        document.getElementById("dsFormat").innerText = d.format;
        document.getElementById("dsSize").innerText = d.size;
        document.getElementById("dsTag").innerText = d.tag;
        if (document.getElementById("dsLikes")) document.getElementById("dsLikes").innerText = d.likes || 0;
        if (document.getElementById("dsDate")) document.getElementById("dsDate").innerText = d.date;
    }
}

function loadSubscriptionDetails() {
    const p = new URLSearchParams(window.location.search);
    const id = parseInt(p.get("id"));
    if (!id || !window.location.pathname.includes("subscription-details.html")) return;
    const s = mySubscriptions.find(x => x.id === id);
    if (s) {
        document.getElementById("subTitle").innerText = s.name;
        document.getElementById("subNameDisplay").innerText = s.name;
        document.getElementById("subTypeDisplay").innerText = s.type;
        document.getElementById("subMembers").innerText = s.members;
        document.getElementById("subReleases").innerText = s.releases;
        document.getElementById("subDescription").innerText = s.description;
        document.getElementById("subInitials").innerText = s.name.substring(0, 2).toUpperCase();
    }
}

function renderModels() {
    const dash = document.querySelector("#dashboard-models-row");
    const table = document.querySelector("#models-table-body");
    if (!dash && !table) return;
    const html = myModels.map(m => dash ? `
        <div class="col-md-4"><div class="card card-item p-3 h-100 shadow-sm border-0">
            <h6 class="fw-semibold"><a href="model-details.html?id=${m.id}" class="text-decoration-none text-dark">${m.name}</a></h6>
            <div class="text-muted small mb-2">${m.framework}</div>
            <span class="tag w-fit">${m.tag}</span>
        </div></div>` : `
        <tr>
            <td class="ps-4"><a href="model-details.html?id=${m.id}" class="text-dark fw-bold text-decoration-none">${m.name}</a></td>
            <td><span class="tag">${m.tag}</span></td><td>${m.size}</td><td>${m.date}</td>
            <td class="text-end pe-4"><button class="btn btn-light btn-sm text-danger" onclick="deleteItem('models', ${m.id})">Удалить</button></td>
        </tr>`).join("");
    if (dash) dash.innerHTML = html;
    if (table) table.innerHTML = html;
}

function renderDatasets() {
    const dash = document.querySelector("#dashboard-datasets-row");
    const table = document.querySelector("#datasets-table-body");
    if (!dash && !table) return;
    const html = myDatasets.map(d => dash ? `
        <div class="col-md-4"><div class="card card-item p-3 h-100 shadow-sm border-0">
            <h6 class="fw-semibold"><a href="dataset-details.html?id=${d.id}" class="text-decoration-none text-dark">${d.name}</a></h6>
            <div class="text-muted small mb-2">${d.format}</div>
            <span class="tag w-fit">${d.tag}</span>
        </div></div>` : `
        <tr>
            <td class="ps-4"><a href="dataset-details.html?id=${d.id}" class="text-dark fw-bold text-decoration-none">${d.name}</a></td>
            <td><span class="tag">${d.tag}</span></td><td>${d.size}</td><td>${d.date}</td>
            <td class="text-end pe-4"><button class="btn btn-light btn-sm text-danger" onclick="deleteItem('datasets', ${d.id})">Удалить</button></td>
        </tr>`).join("");
    if (dash) dash.innerHTML = html;
    if (table) table.innerHTML = html;
}

function renderSubscriptions() {
    const dash = document.querySelector("#dashboard-subs-row");
    const table = document.querySelector("#subs-table-body");

    if (!dash && !table) return;

    const html = mySubscriptions.map(s => dash ? `
        <div class="col-md-4">
            <div class="card card-item p-3 h-100 shadow-sm border-0">
                <h6 class="fw-semibold">
                    <a href="subscription-details.html?id=${s.id}" class="text-decoration-none text-dark">${s.name}</a>
                </h6>
                <div class="text-muted small mb-2">${s.type}</div>
                <span class="tag w-fit">${s.updates}</span>
            </div>
        </div>` : `
        <tr>
            <td class="ps-4">
                <a href="subscription-details.html?id=${s.id}" class="text-dark fw-bold text-decoration-none">${s.name}</a>
            </td>
            <td><span class="tag">${s.updates}</span></td>
            <td>Активна</td>
            <td>${s.date}</td>
            <td class="text-end pe-4">
                <button class="btn btn-light btn-sm text-danger" onclick="deleteItem('subs', ${s.id})">Отписаться</button>
            </td>
        </tr>`).join("");

    if (dash) dash.innerHTML = html;
    if (table) table.innerHTML = html;
}

async function deleteItem(type, id) {
    if (!confirm("Вы уверены?")) return;
    const map = {
        models: { list: myModels, path: "myModels", render: renderModels },
        datasets: { list: myDatasets, path: "myDatasets", render: renderDatasets },
        subs: { list: mySubscriptions, path: "mySubscriptions", render: renderSubscriptions }
    };
    const item = map[type];
    if (!item) return;

    await api(`/${item.path}/${id}`, { method: "DELETE" });
    item.list.splice(item.list.findIndex(x => x.id === id), 1);
    item.render();
}

async function addToMy(type, id) {
    const isModel = type === "models";
    const source = isModel ? globalModels : globalDatasets;
    const target = isModel ? myModels : myDatasets;
    const endpoint = isModel ? "myModels" : "myDatasets";
    const item = source.find(x => x.id === id);

    if (item && !target.find(x => x.id === id)) {
        const created = await api(`/${endpoint}`, {
            method: "POST",
            body: { ...item, date: new Date().toLocaleDateString() }
        });
        target.push(created);
        alert("Добавлено в вашу коллекцию!");
    } else {
        alert("Уже добавлено");
    }
}

function loadSettings() {
    if (!document.getElementById("userNameInput")) return;
    document.getElementById("userNameInput").value = localStorage.getItem("userName") || "";
    document.getElementById("userEmailInput").value = localStorage.getItem("userEmail") || "";
    const avatar = localStorage.getItem("userAvatarBase64");
    if (avatar && document.getElementById("userAvatar")) document.getElementById("userAvatar").src = avatar;
}

function handleSettingsSave() {
    const btn = document.getElementById("saveSettingsBtn");
    if (btn) btn.onclick = () => {
        localStorage.setItem("userName", document.getElementById("userNameInput").value);
        localStorage.setItem("userEmail", document.getElementById("userEmailInput").value);
        btn.innerText = "Сохранено!";
        setTimeout(() => btn.innerText = "Сохранить", 1500);
    };
}

function setupAvatarUpload() {
    const inp = document.getElementById("avatarInput");
    if (inp) inp.onchange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            localStorage.setItem("userAvatarBase64", reader.result);
            if (document.getElementById("userAvatar")) document.getElementById("userAvatar").src = reader.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    };
}

function setupUploadModal() {
    const btn = document.getElementById("submitUpload") || document.querySelector("#uploadModal .btn-primary");
    if (btn) btn.onclick = async () => {
        const modal = btn.closest(".modal-content");
        const name = modal.querySelector("input")?.value.trim();
        const type = modal.querySelector("select")?.value || "model";
        if (!name) {
            alert("Введите название");
            return;
        }

        if (type === "dataset" || type === "Computer Vision" || type === "NLP" || type === "Tabular" || type === "Audio") {
            const dataset = await api("/myDatasets", {
                method: "POST",
                body: {
                    name,
                    format: "JSON",
                    size: "0MB",
                    tag: type === "dataset" ? "Custom" : type,
                    date: new Date().toLocaleDateString(),
                    rows: "0",
                    description: "Пользовательский датасет",
                    likes: 0,
                    license: "Private"
                }
            });
            myDatasets.push(dataset);
            renderDatasets();
        } else {
            const model = await api("/myModels", {
                method: "POST",
                body: {
                    name,
                    framework: "Custom",
                    size: "0MB",
                    tag: type,
                    date: new Date().toLocaleDateString(),
                    author: localStorage.getItem("userName") || "Пользователь",
                    description: "Пользовательская модель",
                    version: "1.0.0",
                    likes: 0,
                    forks: 0,
                    license: "Private"
                }
            });
            myModels.push(model);
            renderModels();
        }

        alert("Успешно отправлено на модерацию!");
    };
}
