const API_URL = "http://localhost:3000";
const HF_API_BASE = "https://huggingface.co/api/models";
const THEME_STORAGE_KEY = "aibloom-theme";

function announce(message) {
    const statusRegion = document.getElementById("appStatus");
    if (!statusRegion) return;

    statusRegion.textContent = "";
    window.setTimeout(() => {
        statusRegion.textContent = message;
    }, 50);
}

function setBusy(element, isBusy) {
    if (element) {
        element.setAttribute("aria-busy", String(isBusy));
    }
}

function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function formatCount(value) {
    return Number(value || 0).toLocaleString("ru-RU");
}

function getModelDetailsUrl(model) {
    if (model.detailsPage) {
        return model.detailsPage;
    }

    if (model.name === "Forest-Vision v2") {
        return "details.html";
    }

    return null;
}

// Блок функций ниже отвечает за выбор, применение и сохранение темы сайта.
function getPreferredTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function updateThemeToggleLabel(theme) {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    const nextThemeLabel = theme === "dark" ? "Светлая тема" : "Тёмная тема";
    toggle.textContent = nextThemeLabel;
    toggle.setAttribute("aria-label", `Переключить тему. Сейчас активна ${theme === "dark" ? "тёмная" : "светлая"} тема.`);
}

function applyTheme(theme) {
    document.body.dataset.theme = theme;
    updateThemeToggleLabel(theme);
}

function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const theme = savedTheme || getPreferredTheme();
    applyTheme(theme);

    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
        const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
        announce(`Тема сайта переключена: ${nextTheme === "dark" ? "тёмная" : "светлая"}.`);
    });
}

async function loadModels(filterParams = "") {
    const grid = document.getElementById("model-grid");
    if (!grid) return;

    setBusy(grid, true);
    grid.innerHTML = `
        <div class="text-center py-5 w-100">
            <div class="spinner-border text-success" role="status" aria-hidden="true"></div>
            <p class="mt-2 text-muted mb-0">Загружаем результаты поиска...</p>
            <span class="visually-hidden">Загрузка результатов поиска</span>
        </div>
    `;

    try {
        const url = `${HF_API_BASE}?sort=downloads&direction=-1&limit=7&full=true${filterParams}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const models = await response.json();
        grid.innerHTML = "";

        if (!models.length) {
            grid.innerHTML = `<p class="text-muted py-4">По вашему запросу ничего не найдено.</p>`;
            announce("Результаты поиска не найдены.");
            return;
        }

        models.forEach((model, index) => {
            const colClass = index === 0 ? "col-12 mb-4" : "col-md-4 mb-4";
            const modelName = escapeHtml(model.modelId.split("/").pop());
            const author = escapeHtml(model.modelId.split("/")[0]);
            const downloads = formatCount(model.downloads);
            const task = escapeHtml(model.pipeline_tag || "AI Model");
            const library = escapeHtml(model.library_name || "Transformers");
            const headingLevelClass = index === 0 ? "h4" : "h5";

            grid.insertAdjacentHTML(
                "beforeend",
                `
                <div class="${colClass}">
                    <article class="card h-100 border-0 shadow-sm card-hover ${index === 0 ? "bg-light-bloom" : ""}" aria-labelledby="model-card-title-${index}">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <span class="badge bg-primary text-white">${task}</span>
                                <span class="text-muted small" aria-label="${downloads} загрузок">📥 ${downloads}</span>
                            </div>
                            <h3 id="model-card-title-${index}" class="card-title ${headingLevelClass} fw-bold">
                                ${modelName}${index === 0 ? ' <span aria-hidden="true">🌟</span>' : ""}
                            </h3>
                            <p class="small text-muted mb-1">Автор: ${author}</p>
                            <div class="d-flex justify-content-between align-items-center mt-4">
                                <span class="small" style="color: var(--bloom-green); font-weight: 500;">
                                    ${library}
                                </span>
                                <a href="https://huggingface.co/${encodeURIComponent(model.modelId).replace("%2F", "/")}" target="_blank" rel="noopener noreferrer" class="btn btn-sm ${index === 0 ? "btn-primary" : "btn-outline-primary"} px-3" aria-label="Открыть страницу модели ${modelName} на Hugging Face в новой вкладке">
                                    Изучить
                                </a>
                            </div>
                        </div>
                    </article>
                </div>`
            );
        });

        announce(`Загружено ${models.length} результатов поиска.`);
    } catch (error) {
        console.error("Ошибка API:", error);
        grid.innerHTML = `<p class="text-danger py-4">Не удалось загрузить модели. Проверьте подключение к интернету и повторите попытку.</p>`;
        announce("Не удалось загрузить результаты поиска.");
    } finally {
        setBusy(grid, false);
    }
}

async function loadHuggingFaceTrends() {
    const container = document.getElementById("hf-trends-grid");
    if (!container) return;

    setBusy(container, true);

    try {
        const response = await fetch(`${HF_API_BASE}?sort=downloads&direction=-1&limit=8`);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const models = await response.json();
        container.innerHTML = "";

        models.forEach((model, index) => {
            const modelName = escapeHtml(model.modelId.split("/").pop());
            const downloads = formatCount(model.downloads);

            container.insertAdjacentHTML(
                "beforeend",
                `
                <div class="col-md-3 mb-4">
                    <article class="card h-100 card-hover p-3 shadow-sm border-0" aria-labelledby="trend-title-${index}">
                        <div class="card-body">
                            <h3 id="trend-title-${index}" class="h6 fw-bold text-truncate">${modelName}</h3>
                            <p class="small text-muted mb-0" aria-label="${downloads} загрузок">📥 ${downloads}</p>
                        </div>
                    </article>
                </div>`
            );
        });

        announce("Блок мировых трендов обновлен.");
    } catch (error) {
        console.error("Ошибка загрузки трендов:", error);
        container.innerHTML = `<p class="text-danger py-4">Не удалось загрузить мировые тренды.</p>`;
        announce("Не удалось загрузить мировые тренды.");
    } finally {
        setBusy(container, false);
    }
}

async function loadUserModels() {
    const container = document.getElementById("user-models-list");
    if (!container) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    setBusy(container, true);

    try {
        const response = await fetch(`${API_URL}/models?userId=${currentUser.id}`);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const models = await response.json();
        container.innerHTML = "";

        if (models.length === 0) {
            container.innerHTML = `<p class="text-muted py-4">Ваш личный сад пока пуст.</p>`;
            announce("В вашем профиле пока нет загруженных моделей.");
            return;
        }

        models.forEach((model) => {
            const safeName = escapeHtml(model.name);
            const safeType = escapeHtml(model.type);
            const icon = model.type === "model" ? "🌳" : "🌱";
            const detailsUrl = getModelDetailsUrl(model);
            const titleMarkup = detailsUrl
                ? `<a href="${escapeHtml(detailsUrl)}" class="text-decoration-none text-reset fw-bold" aria-label="Открыть тестовую страницу модели ${safeName}">${safeName}</a>`
                : safeName;
            const actionMarkup = detailsUrl
                ? `<div class="d-flex gap-2 align-items-center">
                        <a href="${escapeHtml(detailsUrl)}" class="btn btn-sm btn-outline-primary" aria-label="Перейти на страницу модели ${safeName}">
                            Открыть
                        </a>
                        <button type="button" onclick="deleteUserModel('${model.id}')" class="btn btn-sm btn-outline-danger" aria-label="Удалить элемент ${safeName}">
                            Удалить
                        </button>
                   </div>`
                : `<button type="button" onclick="deleteUserModel('${model.id}')" class="btn btn-sm btn-outline-danger" aria-label="Удалить элемент ${safeName}">
                        Удалить
                   </button>`;

            container.insertAdjacentHTML(
                "beforeend",
                `
                <article class="card border-0 shadow-sm mb-3">
                    <div class="card-body d-flex justify-content-between align-items-center p-4">
                        <div class="d-flex align-items-center">
                            <div class="bg-soft-blue p-3 rounded-4 me-3" aria-hidden="true">${icon}</div>
                            <div>
                                <h3 class="h6 mb-1">${titleMarkup}</h3>
                                <span class="badge bg-light text-dark mb-1">${safeType}</span>
                                <br><small class="text-muted">Личный проект пользователя</small>
                            </div>
                        </div>
                        ${actionMarkup}
                    </div>
                </article>`
            );
        });
    } catch (error) {
        console.error("Ошибка загрузки пользовательских моделей:", error);
        container.innerHTML = `<p class="text-danger py-4">Не удалось загрузить ваш инвентарь.</p>`;
        announce("Не удалось загрузить данные профиля.");
    } finally {
        setBusy(container, false);
    }
}

window.deleteUserModel = async function (id) {
    if (!confirm("Вы уверены, что хотите удалить этот элемент?")) return;

    try {
        await fetch(`${API_URL}/models/${id}`, { method: "DELETE" });
        announce("Элемент удален из вашего сада.");
        loadUserModels();
    } catch (error) {
        console.error("Ошибка удаления:", error);
        alert("Не удалось удалить элемент.");
        announce("Не удалось удалить элемент.");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const filterForm = document.getElementById("filterForm");
    const searchForm = document.getElementById("searchForm");
    const commentForm = document.getElementById("commentForm");
    const commentList = document.getElementById("commentList");
    const commentInput = document.getElementById("commentInput");
    const uploadForm = document.getElementById("uploadForm");
    const starBtn = document.getElementById("starBtn");
    const forkBtn = document.getElementById("forkBtn");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Инициализация темы должна срабатывать при загрузке каждой страницы.
    initTheme();

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            try {
                const response = await fetch(`${API_URL}/users?email=${email}&password=${password}`);

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const users = await response.json();

                if (users.length > 0) {
                    localStorage.setItem("currentUser", JSON.stringify(users[0]));
                    announce(`Вы вошли как ${users[0].name}.`);
                    alert(`Добро пожаловать в сад, ${users[0].name}!`);
                    window.location.href = "profile.html";
                } else {
                    announce("Ошибка входа: неверный email или пароль.");
                    alert("Ошибка: неверный email или пароль.");
                }
            } catch (error) {
                console.error("Ошибка входа:", error);
                announce("Нужно запустить json-server.");
                alert("Ошибка: нужно запустить json-server!");
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const newUser = {
                name: document.getElementById("regName").value,
                email: document.getElementById("regEmail").value,
                password: document.getElementById("regPassword").value
            };

            try {
                const response = await fetch(`${API_URL}/users`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newUser)
                });

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                announce("Аккаунт успешно создан.");
                alert("Семена посеяны! Аккаунт успешно создан в базе.");
                window.location.href = "login.html";
            } catch (error) {
                console.error("Ошибка при регистрации:", error);
                announce("Не удалось сохранить пользователя.");
                alert("Не удалось сохранить пользователя. Проверьте json-server.");
            }
        });
    }

    if (currentUser) {
        const navLoginLink = document.querySelector('a[href="login.html"]');
        if (navLoginLink) {
            navLoginLink.textContent = currentUser.name;
            navLoginLink.href = "profile.html";
            navLoginLink.setAttribute("aria-label", `Профиль пользователя ${currentUser.name}`);
        }

        const profileName = document.querySelector("aside h1, aside h4");
        if (profileName) {
            profileName.textContent = currentUser.name;
        }

        const profileSubtext = document.querySelector("aside p.text-muted");
        if (profileSubtext) {
            profileSubtext.textContent = `Выращиваю нейросети с 2024 года • ${currentUser.email}`;
        }
    }

    const applyFilters = (event) => {
        if (event) event.preventDefault();

        const tags = [];
        let filterQuery = "";
        const searchInput = document.getElementById("searchInput");

        if (searchInput && searchInput.value.trim()) {
            filterQuery += `&search=${encodeURIComponent(searchInput.value.trim())}`;
        }

        const taskSelect = document.getElementById("taskSelect");
        const licenseSelect = document.getElementById("licenseSelect");

        if (taskSelect && taskSelect.value) {
            tags.push(taskSelect.value);
        }

        if (licenseSelect && licenseSelect.value) {
            tags.push(`license:${licenseSelect.value}`);
        }

        document.querySelectorAll(".fw-check:checked").forEach((checkbox) => {
            tags.push(checkbox.value);
        });

        if (tags.length > 0) {
            filterQuery += `&filter=${tags.join(",")}`;
        }

        loadModels(filterQuery);
    };

    if (filterForm) {
        filterForm.addEventListener("submit", applyFilters);
    }

    if (searchForm) {
        searchForm.addEventListener("submit", applyFilters);
    }

    loadModels();
    loadHuggingFaceTrends();
    loadUserModels();

    if (uploadForm) {
        uploadForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (!currentUser) return;

            const submitButton = event.target.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;

            submitButton.innerHTML = "🌱 Посев...";
            submitButton.disabled = true;

            const newModel = {
                name: document.getElementById("modelName").value,
                type: document.getElementById("modelType").value,
                userId: currentUser.id,
                stars: 0
            };

            try {
                const response = await fetch(`${API_URL}/models`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newModel)
                });

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                announce("Новый элемент добавлен в ваш сад.");
                alert("Модель успешно сохранена в вашем личном инвентаре!");

                const modalElement = document.getElementById("uploadModal");
                const modal = modalElement ? bootstrap.Modal.getInstance(modalElement) : null;
                if (modal) {
                    modal.hide();
                }

                uploadForm.reset();
                loadUserModels();
            } catch (error) {
                console.error("Ошибка сохранения:", error);
                announce("Не удалось сохранить элемент.");
                alert("Ошибка при сохранении.");
            } finally {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }

    if (starBtn) {
        const countSpan = starBtn.querySelector(".count");
        let count = parseInt(countSpan.textContent.replace(/\s/g, ""), 10);
        let isStarred = localStorage.getItem("modelStarred") === "true";

        const syncStarState = () => {
            starBtn.setAttribute("aria-pressed", String(isStarred));
            starBtn.setAttribute(
                "aria-label",
                `${isStarred ? "Убрать звезду у модели" : "Поставить звезду модели"}. Сейчас ${formatCount(count)} звёзд.`
            );

            if (isStarred) {
                starBtn.classList.replace("btn-outline-primary", "btn-primary");
            } else {
                starBtn.classList.replace("btn-primary", "btn-outline-primary");
            }
        };

        syncStarState();

        starBtn.addEventListener("click", () => {
            isStarred = !isStarred;
            localStorage.setItem("modelStarred", String(isStarred));
            count += isStarred ? 1 : -1;
            countSpan.textContent = formatCount(count);
            syncStarState();
            announce(isStarred ? "Вы поставили звезду модели." : "Вы убрали звезду у модели.");
        });
    }

    if (commentForm && commentList && commentInput) {
        commentForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const text = commentInput.value.trim();

            if (!text) return;

            const newComment = document.createElement("article");
            newComment.className = "d-flex mb-3 pb-3 border-bottom animate-fade-in";
            newComment.setAttribute("role", "listitem");
            newComment.innerHTML = `
                <img src="https://ui-avatars.com/api/?name=Guest&background=F4A261&color=fff" class="rounded-circle me-3" width="40" height="40" alt="Ваш аватар">
                <div>
                    <h3 class="h6 mb-0 fw-bold">Вы (Гость) <span class="badge bg-light text-muted fw-normal ms-2">Только что</span></h3>
                    <p class="mb-0 small text-muted">${escapeHtml(text)}</p>
                </div>
            `;

            commentList.prepend(newComment);
            commentInput.value = "";
            announce("Комментарий добавлен.");
        });
    }

    if (forkBtn) {
        forkBtn.addEventListener("click", () => {
            const forkCount = forkBtn.querySelector(".count");
            const nextCount = parseInt(forkCount.textContent.replace(/\s/g, ""), 10) + 1;
            forkCount.textContent = formatCount(nextCount);
            forkBtn.setAttribute("aria-label", `Сделать форк модели. Сейчас ${formatCount(nextCount)} форков.`);
            announce("Модель скопирована в ваш сад.");
            alert("Модель успешно скопирована (форкнута) в ваш сад!");
        });
    }

    const logoutBtn = document.querySelector('a[href="index.html"].btn-outline-danger');
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            announce("Вы вышли из аккаунта.");
        });
    }
});
