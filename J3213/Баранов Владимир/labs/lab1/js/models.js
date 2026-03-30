document.addEventListener("DOMContentLoaded", function () {
    if (!requireAuth()) return;
    setupNavbarAuth();

    const tbody = document.getElementById("modelsTbody");
    const createModelForm = document.getElementById("createModelForm");
    const createModelError = document.getElementById("createModelError");
    const createModelModalEl = document.getElementById("createModelModal");
    const createModelModal = createModelModalEl && window.bootstrap
        ? new window.bootstrap.Modal(createModelModalEl)
        : null;

    const STATUS_BADGE = {
        "Тестирование": "secondary",
        "В проде": "success",
        "Архив": "dark"
    };

    const statusBadge = (status) => {
        const color = STATUS_BADGE[status] || "secondary";
        return '<span class="badge bg-' + color + '">' + status + "</span>";
    };

    const renderModels = (models) => {
        if (!tbody) return;
        tbody.innerHTML = "";

        if (!models || models.length === 0) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 5;
            td.className = "text-center text-muted";
            td.textContent = "Нет моделей. Зарегистрируйте первую!";
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        models.forEach(function (model) {
            const tr = document.createElement("tr");
            const tdName = document.createElement("td");
            const tdVersion = document.createElement("td");
            const tdStatus = document.createElement("td");
            const tdDate = document.createElement("td");
            const tdActions = document.createElement("td");

            tdName.textContent = model.name;
            tdVersion.textContent = model.version;
            tdStatus.innerHTML = statusBadge(model.status);
            tdDate.textContent = model.date;

            const deployBtn = document.createElement("button");
            deployBtn.type = "button";
            deployBtn.className = "btn btn-sm btn-success me-1";
            deployBtn.textContent = "Deploy";
            deployBtn.disabled = model.status === "В проде";
            deployBtn.addEventListener("click", function () {
                updateModelStatus(model.id, "В проде");
            });

            const archiveBtn = document.createElement("button");
            archiveBtn.type = "button";
            archiveBtn.className = "btn btn-sm btn-outline-secondary me-1";
            archiveBtn.textContent = "Archive";
            archiveBtn.disabled = model.status === "Архив";
            archiveBtn.addEventListener("click", function () {
                updateModelStatus(model.id, "Архив");
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "btn btn-sm btn-outline-danger";
            deleteBtn.textContent = "Удалить";
            deleteBtn.addEventListener("click", function () {
                deleteModel(model.id);
            });

            tdActions.appendChild(deployBtn);
            tdActions.appendChild(archiveBtn);
            tdActions.appendChild(deleteBtn);

            [tdName, tdVersion, tdStatus, tdDate, tdActions].forEach(function (td) {
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    };

    const loadModels = () => {
        const userId = apiGetCurrentUserId();
        if (!userId) return;

        apiClient()
            .get("/600/models", { params: { userId: userId, _sort: "date", _order: "desc" } })
            .then(function (res) {
                renderModels(res.data || []);
            })
            .catch(function () {
                renderModels([]);
            });
    };

    const updateModelStatus = (modelId, status) => {
        apiClient()
            .patch("/600/models/" + modelId, { status: status })
            .then(loadModels)
            .catch(function () {
                alert("Не удалось изменить статус модели.");
            });
    };

    const deleteModel = (modelId) => {
        if (!confirm("Удалить модель?")) return;
        apiClient()
            .delete("/600/models/" + modelId)
            .then(loadModels)
            .catch(function () {
                alert("Не удалось удалить модель.");
            });
    };

    if (createModelForm) {
        createModelForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const userId = apiGetCurrentUserId();
            if (!userId) return;

            const name = document.getElementById("modelNameInput").value.trim();
            const version = document.getElementById("modelVersionInput").value.trim();
            const framework = document.getElementById("modelFramework").value;

            if (!name || !version) {
                if (createModelError) {
                    createModelError.textContent = "Введите название и версию.";
                    createModelError.classList.remove("d-none");
                }
                return;
            }
            if (createModelError) createModelError.classList.add("d-none");

            const payload = {
                userId: userId,
                name: name,
                version: version,
                framework: framework,
                status: "Тестирование",
                date: new Date().toISOString().slice(0, 10)
            };

            apiClient()
                .post("/600/models", payload)
                .then(function () {
                    createModelForm.reset();
                    if (createModelModal) createModelModal.hide();
                    loadModels();
                })
                .catch(function () {
                    if (createModelError) {
                        createModelError.textContent = "Ошибка при регистрации. Проверьте, что API запущен.";
                        createModelError.classList.remove("d-none");
                    }
                });
        });
    }

    loadModels();
});