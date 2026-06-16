const myModels = [
    { id: 1, name: "Image Classifier Pro", framework: "PyTorch", size: "120MB", tag: "CV", date: "12.05.2024", author: "Vision Team", description: "Высокоточная сверточная нейронная сеть для классификации объектов.", version: "2.4.0-stable", likes: 128, forks: 14, license: "MIT" },
    { id: 2, name: "NLP Sentiment Analysis", framework: "Transformers", size: "450MB", tag: "NLP", date: "10.05.2024", author: "TextAI Group", description: "Модель на базе архитектуры BERT для анализа тональности текста.", version: "1.0.2", likes: 85, forks: 5, license: "Apache 2.0" },
    { id: 3, name: "Object Detector v8", framework: "PyTorch", size: "85MB", tag: "CV", date: "15.05.2024", author: "Vision Team", description: "Быстрая модель для детекции объектов в реальном времени.", version: "8.1.0", likes: 45, forks: 12, license: "GPL-3.0" },
    { id: 4, name: "Voice-to-Text RU", framework: "TensorFlow", size: "1.2GB", tag: "Audio", date: "18.05.2024", author: "SoundLab", description: "Специализированная модель для распознавания русской речи.", version: "0.5.2-alpha", likes: 67, forks: 8, license: "MIT" }
];

const myDatasets = [
    { id: 1, name: "Cats vs Dogs HD", format: "Images (JPG)", size: "2.1GB", tag: "CV", date: "11.05.2024", rows: "25,000", description: "Набор фото кошек и собак для бинарной классификации.", likes: 210, license: "CC-BY-4.0" },
    { id: 2, name: "Russian News Corpus", format: "JSONL", size: "850MB", tag: "NLP", date: "14.05.2024", rows: "1,200,000", description: "Собрание новостных заголовков и текстов за 2023 год.", likes: 92, license: "MIT" },
    { id: 3, name: "Satellite Earth View", format: "GeoTIFF", size: "15GB", tag: "Vision", date: "16.05.2024", rows: "5,000", description: "Спутниковые снимки высокого разрешения для сегментации дорог.", likes: 124, license: "OdbL" }
];

const mySubscriptions = [
    { id: 1, name: "NLP Research Group", type: "Community", updates: "5 новых моделей", date: "12.04.2026", members: "12,405", releases: "142", description: "Ведущее сообщество по разработке и оптимизации языковых моделей." },
    { id: 2, name: "Visionary AI", type: "Author", updates: "1 датасет", date: "10.04.2026", members: "3,120", releases: "28", description: "Исследователь в области компьютерного зрения." },
    { id: 3, name: "DeepMind Fan Club", type: "Community", updates: "0 обновлений", date: "01.05.2026", members: "45,000", releases: "500", description: "Новости и разборы архитектур от DeepMind." }
];

const globalModels = [
    { id: 101, name: "Llama 3 8B Russian", framework: "GGUF", size: "5.5GB", tag: "LLM", author: "Meta", description: "Оптимизированная Llama 3 для русского языка.", likes: 1205, forks: 340, license: "Llama 3" },
    { id: 102, name: "Stable Diffusion XL", framework: "Diffusers", size: "6.4GB", tag: "GenAI", author: "Stability AI", description: "Генерация изображений высокого разрешения.", likes: 890, forks: 120, license: "OpenRail" },
    { id: 103, name: "Whisper Large v3", framework: "OpenAI", size: "1.5GB", tag: "Audio", author: "OpenAI", description: "Распознавание речи мирового уровня.", likes: 450, forks: 89, license: "MIT" },
    { id: 104, name: "Mistral 7B v0.3", framework: "Transformers", size: "14GB", tag: "LLM", author: "Mistral AI", description: "Легкая, но мощная языковая модель общего назначения.", likes: 2100, forks: 450, license: "Apache 2.0" },
    { id: 105, name: "YOLOv10-Nano", framework: "PyTorch", size: "15MB", tag: "CV", author: "THU-MIG", description: "Самая быстрая модель для детекции на мобильных устройствах.", likes: 730, forks: 210, license: "AGPL-3.0" }
];

const globalDatasets = [
    { id: 201, name: "Common Crawl RU", format: "WARC", size: "45TB", tag: "Web", date: "01.04.2026", rows: "Миллиарды", description: "Гигантский архив веб-страниц рунета.", likes: 560, license: "Apache 2.0" },
    { id: 202, name: "CelebA-HQ Russian", format: "JPG", size: "15GB", tag: "CV", date: "22.03.2026", rows: "30,000", description: "Портреты высокого разрешения для обучения GAN.", likes: 320, license: "MIT" },
    { id: 203, name: "ImageNet-1K", format: "TFR", size: "160GB", tag: "CV", date: "05.01.2026", rows: "1,200,000", description: "Золотой стандарт для обучения классификации изображений.", likes: 4500, license: "Custom" },
    { id: 204, name: "OpenSubtitles RU-EN", format: "CSV", size: "4.2GB", tag: "NLP", date: "10.02.2026", rows: "50,000,000", description: "Параллельный корпус для обучения машинного перевода.", likes: 890, license: "CC-BY-NC" }
];

document.addEventListener("DOMContentLoaded", () => {
    setupTheme();
    fakeAuthCheck();
    setupAuthForms();
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

function setupTheme() {
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const currentTheme = savedTheme || systemTheme;
    const btn = document.createElement("button");

    document.documentElement.dataset.theme = currentTheme;
    btn.className = "btn btn-light btn-sm theme-toggle";
    btn.type = "button";

    const updateButton = () => {
        btn.innerText = document.documentElement.dataset.theme === "dark" ? "Светлая" : "Тёмная";
    };

    btn.onclick = () => {
        const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = nextTheme;
        localStorage.setItem("theme", nextTheme);
        updateButton();
    };

    updateButton();

    const topbar = document.querySelector(".topbar");
    const authActions = document.querySelector("header .ms-auto");
    if (topbar) {
        const actions = document.createElement("div");
        const mainAction = topbar.querySelector(".upload-btn, #saveSettingsBtn");

        actions.className = "ms-auto d-flex align-items-center gap-2";
        if (mainAction) actions.appendChild(mainAction);
        actions.appendChild(btn);
        topbar.appendChild(actions);
    }
    if (authActions) authActions.prepend(btn);
}

function fakeAuthCheck() {
    const isAuthPage = window.location.pathname.includes("login.html") || window.location.pathname.includes("register.html");
    if (!localStorage.getItem("user") && !isAuthPage) {
        window.location.href = "login.html";
    }
}

function setupAuthForms() {
    const loginForm = document.querySelector('title')?.innerText.includes("Вход") ? document.querySelector("form") : null;
    const registerForm = document.querySelector('title')?.innerText.includes("Регистрация") ? document.querySelector("form") : null;

    if (loginForm) {
        loginForm.onsubmit = (event) => {
            event.preventDefault();
            const email = loginForm.querySelector('input[type="email"]')?.value.trim();
            localStorage.setItem("user", email || "demo@dataport.ai");
            if (email && !localStorage.getItem("userEmail")) localStorage.setItem("userEmail", email);
            window.location.href = "dashboard.html";
        };
    }

    if (registerForm) {
        registerForm.onsubmit = (event) => {
            event.preventDefault();
            const inputs = registerForm.querySelectorAll("input");
            const name = inputs[0]?.value.trim() || "";
            const email = registerForm.querySelector('input[type="email"]')?.value.trim() || "";
            const passwords = registerForm.querySelectorAll('input[type="password"]');

            if (passwords[0]?.value !== passwords[1]?.value) {
                alert("Пароли не совпадают");
                return;
            }

            localStorage.setItem("user", email || name || "demo@dataport.ai");
            localStorage.setItem("userName", name);
            localStorage.setItem("userEmail", email);
            window.location.href = "dashboard.html";
        };
    }
}

function handleLogout() {
    const btn = document.getElementById('logoutBtn');
    if (btn) btn.onclick = () => { localStorage.removeItem("user"); window.location.href = "login.html"; };
}

function socialAction(type, category = 'model') {
    const prefix = category === 'model' ? 'model' : 'ds';
    const idName = type === 'like' ? prefix + 'Likes' : prefix + 'Forks';
    const countEl = document.getElementById(idName);

    if (countEl) {
        let count = parseInt(countEl.innerText);
        countEl.innerText = count + 1;
        const btn = event.currentTarget;
        btn.classList.remove('btn-outline-primary', 'btn-outline-secondary');
        btn.classList.add(type === 'like' ? 'btn-primary' : 'btn-secondary');
    }
}

function addComment() {
    const input = document.getElementById('commentInput');
    const list = document.getElementById('commentsList');
    if (!input || !input.value.trim()) return;

    const user = localStorage.getItem("userName") || "Пользователь";
    const commentHtml = `
        <div class="p-3 bg-light rounded-4 mb-3 shadow-sm" style="border-left: 4px solid var(--primary);">
            <div class="fw-bold small mb-1">${user} <span class="text-muted fw-normal ms-2">Только что</span></div>
            <div class="small text-dark">${input.value}</div>
        </div>`;

    list.insertAdjacentHTML('afterbegin', commentHtml);
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
            </div>`).join('') || '<p class="text-muted p-3">Модели не найдены</p>';
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
            </div>`).join('') || '<p class="text-muted p-3">Датасеты не найдены</p>';
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
    const id = parseInt(p.get('id'));
    if (!id || !window.location.pathname.includes('model-details.html')) return;
    const m = [...myModels, ...globalModels].find(x => x.id === id);
    if (m) {
        document.getElementById('modelTitle').innerText = m.name;
        document.getElementById('modelDescription').innerText = m.description;
        document.getElementById('modelAuthor').innerText = m.author;
        document.getElementById('modelFramework').innerText = m.framework || "N/A";
        document.getElementById('modelSize').innerText = m.size;
        document.getElementById('modelTag').innerText = m.tag;
        document.getElementById('modelLikes').innerText = m.likes || 0;
        document.getElementById('modelForks').innerText = m.forks || 0;
        document.getElementById('modelSlug').innerText = m.name.toLowerCase().replace(/\s+/g, '-');
    }
}

function loadDatasetDetails() {
    const p = new URLSearchParams(window.location.search);
    const id = parseInt(p.get('id'));
    if (!id || !window.location.pathname.includes('dataset-details.html')) return;
    const d = [...myDatasets, ...globalDatasets].find(x => x.id === id);
    if (d) {
        document.getElementById('dsTitle').innerText = d.name;
        document.getElementById('dsDescription').innerText = d.description;
        document.getElementById('dsRows').innerText = d.rows || "N/A";
        document.getElementById('dsFormat').innerText = d.format;
        document.getElementById('dsSize').innerText = d.size;
        document.getElementById('dsTag').innerText = d.tag;
        if(document.getElementById('dsLikes')) document.getElementById('dsLikes').innerText = d.likes || 0;
        if(document.getElementById('dsDate')) document.getElementById('dsDate').innerText = d.date;
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
        document.getElementById('subInitials').innerText = s.name.substring(0, 2).toUpperCase();
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
        </tr>`).join('');
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
        </tr>`).join('');
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
        </tr>`).join('');

    if (dash) dash.innerHTML = html;
    if (table) table.innerHTML = html;
}

function deleteItem(type, id) {
    if (!confirm("Вы уверены?")) return;
    if (type === 'models') myModels.splice(myModels.findIndex(x => x.id === id), 1);
    if (type === 'datasets') myDatasets.splice(myDatasets.findIndex(x => x.id === id), 1);
    if (type === 'subs') mySubscriptions.splice(mySubscriptions.findIndex(x => x.id === id), 1);
    renderModels(); renderDatasets(); renderSubscriptions();
}

function addToMy(type, id) {
    const source = type === 'models' ? globalModels : globalDatasets;
    const target = type === 'models' ? myModels : myDatasets;
    const item = source.find(x => x.id === id);
    if (item && !target.find(x => x.id === id)) {
        target.push({...item, date: new Date().toLocaleDateString()});
        alert("Добавлено в вашу коллекцию!");
    } else alert("Уже добавлено");
}

function loadSettings() {
    if (!document.getElementById("userNameInput")) return;
    document.getElementById("userNameInput").value = localStorage.getItem("userName") || "";
    document.getElementById("userEmailInput").value = localStorage.getItem("userEmail") || "";
    const avatar = localStorage.getItem("userAvatarBase64");
    if (avatar && document.getElementById('userAvatar')) document.getElementById('userAvatar').src = avatar;
}

function handleSettingsSave() {
    const btn = document.getElementById('saveSettingsBtn');
    if (btn) btn.onclick = () => {
        localStorage.setItem("userName", document.getElementById("userNameInput").value);
        localStorage.setItem("userEmail", document.getElementById("userEmailInput").value);
        btn.innerText = "Сохранено!"; setTimeout(() => btn.innerText = "Сохранить", 1500);
    };
}

function setupAvatarUpload() {
    const inp = document.getElementById('avatarInput');
    if (inp) inp.onchange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            localStorage.setItem("userAvatarBase64", reader.result);
            if (document.getElementById('userAvatar')) document.getElementById('userAvatar').src = reader.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    };
}

function setupUploadModal() {
    const btn = document.getElementById("submitUpload");
    if (btn) btn.onclick = () => { alert("Успешно отправлено на модерацию!"); };
}
