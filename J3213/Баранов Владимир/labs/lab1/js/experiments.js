document.addEventListener("DOMContentLoaded", function () {
    if (!requireAuth()) return;
    setupNavbarAuth();

    const dateSelect = document.getElementById("dateFilter");
    const metricSelect = document.getElementById("metricFilter");
    const statusSelect = document.getElementById("statusFilter");
    const tagInput = document.getElementById("tagFilter");
    const applyButton = document.getElementById("applyFilters");
    const resetButton = document.getElementById("resetFilters");
    const tbody = document.getElementById("experimentsTbody");

    const createExpForm = document.getElementById("createExpForm");
    const createExpError = document.getElementById("createExpError");
    const createExpModalEl = document.getElementById("createExpModal");
    const createExpModal = createExpModalEl && window.bootstrap
        ? new window.bootstrap.Modal(createExpModalEl)
        : null;

    const expNameInput = document.getElementById("expNameInput");
    const expMetricName = document.getElementById("expMetricName");
    const expMetricValue = document.getElementById("expMetricValue");
    const expTagsInput = document.getElementById("expTagsInput");
    const expDescriptionInput = document.getElementById("expDescriptionInput");
    const expStageSelect = document.getElementById("expStageSelect");
    const expModelSelect = document.getElementById("expModelSelect");

    const STATUS_UI = {
        Draft: { label: "Черновик", color: "secondary" },
        Running: { label: "Выполняется", color: "primary" },
        Completed: { label: "Завершен", color: "success" },
        Failed: { label: "Ошибка", color: "danger" }
    };

    const normalizeStatus = (status) => {
        if (status === "Выполняется") return "Running";
        if (status === "Завершен") return "Completed";
        return status || "Draft";
    };

    const statusBadge = (status) => {
        const key = normalizeStatus(status);
        const meta = STATUS_UI[key] || { label: key, color: "secondary" };
        return '<span class="badge bg-' + meta.color + '">' + meta.label + "</span>";
    };

    const formatMetric = (exp) => {
        if (!exp.metricName || exp.metricValue === null || exp.metricValue === undefined) return "-";
        return exp.metricName + ": " + exp.metricValue;
    };

    const matchesDateFilter = (expDate, filterValue) => {
        if (!filterValue || filterValue === "За всё время") return true;
        const now = new Date();
        const date = new Date(expDate);
        if (filterValue === "За сегодня") return date.toDateString() === now.toDateString();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (filterValue === "За неделю") return diffDays <= 7;
        if (filterValue === "За месяц") return diffDays <= 30;
        return true;
    };

    const renderEmpty = (text) => {
        if (!tbody) return;
        tbody.innerHTML = "";
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 8;
        td.className = "text-center text-muted";
        td.textContent = text;
        tr.appendChild(td);
        tbody.appendChild(tr);
    };

    const createActionButton = (text, className, disabled, onClick) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = className;
        button.textContent = text;
        button.disabled = disabled;
        button.addEventListener("click", onClick);
        return button;
    };

    const renderExperiments = (experiments) => {
        if (!tbody) return;
        if (!experiments || experiments.length === 0) {
            renderEmpty("Нет экспериментов. Создайте первый!");
            return;
        }

        tbody.innerHTML = "";
        experiments.forEach(function (exp) {
            const tr = document.createElement("tr");
            const status = normalizeStatus(exp.status);

            const tdId = document.createElement("td");
            const link = document.createElement("a");
            link.href = "experiment.html?id=" + exp.id;
            link.textContent = "#" + exp.id;
            tdId.appendChild(link);

            const tdName = document.createElement("td");
            tdName.textContent = exp.name || "-";
            const tdStage = document.createElement("td");
            tdStage.textContent = exp.stage || "-";
            const tdModel = document.createElement("td");
            tdModel.textContent = exp.modelName || "-";
            const tdStatus = document.createElement("td");
            tdStatus.innerHTML = statusBadge(exp.status);
            const tdMetric = document.createElement("td");
            tdMetric.textContent = formatMetric(exp);
            const tdDate = document.createElement("td");
            tdDate.textContent = exp.date || "-";
            const tdActions = document.createElement("td");

            tdActions.appendChild(createActionButton("Start", "btn btn-sm btn-outline-primary me-1", status === "Running", function () {
                updateExperimentStatus(exp.id, "Running");
            }));
            tdActions.appendChild(createActionButton("Finish", "btn btn-sm btn-outline-success me-1", status === "Completed", function () {
                updateExperimentStatus(exp.id, "Completed");
            }));
            tdActions.appendChild(createActionButton("Fail", "btn btn-sm btn-outline-warning me-1", status === "Failed", function () {
                updateExperimentStatus(exp.id, "Failed");
            }));
            tdActions.appendChild(createActionButton("Удалить", "btn btn-sm btn-outline-danger", false, function () {
                deleteExperiment(exp.id);
            }));

            [tdId, tdName, tdStage, tdModel, tdStatus, tdMetric, tdDate, tdActions].forEach(function (td) {
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    };

    const applyFilters = (list) => {
        const metricValue = metricSelect ? metricSelect.value : "Любая";
        const dateValue = dateSelect ? dateSelect.value : "За всё время";
        const statusValue = statusSelect ? statusSelect.value : "Любой";
        const tagValue = tagInput ? tagInput.value.toLowerCase().trim() : "";

        return (list || []).filter(function (exp) {
            if (metricValue !== "Любая" && exp.metricName !== metricValue) return false;
            if (!matchesDateFilter(exp.date, dateValue)) return false;
            if (statusValue !== "Любой" && normalizeStatus(exp.status) !== statusValue) return false;
            if (tagValue) {
                const searchText = (exp.name + " " + (exp.tags || []).join(" ")).toLowerCase();
                if (searchText.indexOf(tagValue) === -1) return false;
            }
            return true;
        });
    };

    const loadExperiments = () => {
        const userId = apiGetCurrentUserId();
        if (!userId) return;
        apiClient()
            .get("/600/experiments", { params: { userId: userId, _sort: "date", _order: "desc" } })
            .then(function (res) {
                renderExperiments(applyFilters(res.data || []));
            })
            .catch(function () {
                renderEmpty("Не удалось загрузить эксперименты");
            });
    };

    const updateExperimentStatus = (id, nextStatus) => {
        apiClient()
            .patch("/600/experiments/" + id, { status: nextStatus })
            .then(loadExperiments)
            .catch(function () {
                alert("Не удалось обновить статус.");
            });
    };

    const deleteExperiment = (id) => {
        if (!confirm("Удалить эксперимент #" + id + "?")) return;
        apiClient()
            .delete("/600/experiments/" + id)
            .then(loadExperiments)
            .catch(function () {
                alert("Не удалось удалить эксперимент.");
            });
    };

    const loadModelsForSelect = () => {
        const userId = apiGetCurrentUserId();
        if (!userId || !expModelSelect) return;

        expModelSelect.innerHTML = '<option value="">— без модели —</option>';
        apiClient()
            .get("/600/models", { params: { userId: userId, _sort: "date", _order: "desc" } })
            .then(function (res) {
                (res.data || []).forEach(function (model) {
                    if (model.status === "Архив") return;
                    const option = document.createElement("option");
                    option.value = String(model.id);
                    option.textContent = model.name + " (" + model.version + ")";
                    option.setAttribute("data-model-name", model.name);
                    expModelSelect.appendChild(option);
                });
            });
    };

    const parseTags = (raw) => raw.split(",").map(function (t) { return t.trim(); }).filter(Boolean);

    if (createExpForm) {
        createExpForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const userId = apiGetCurrentUserId();
            if (!userId) return;

            const name = expNameInput ? expNameInput.value.trim() : "";
            if (!name) {
                if (createExpError) {
                    createExpError.textContent = "Введите название эксперимента.";
                    createExpError.classList.remove("d-none");
                }
                return;
            }
            if (createExpError) createExpError.classList.add("d-none");

            const selectedOption = expModelSelect ? expModelSelect.options[expModelSelect.selectedIndex] : null;
            const payload = {
                userId: userId,
                author: apiGetCurrentUsername() || "user",
                name: name,
                description: expDescriptionInput ? expDescriptionInput.value.trim() : "",
                stage: expStageSelect ? expStageSelect.value : "Train",
                status: "Draft",
                metricName: expMetricName ? expMetricName.value || null : null,
                metricValue: expMetricValue && expMetricValue.value !== "" ? parseFloat(expMetricValue.value) : null,
                modelId: expModelSelect && expModelSelect.value ? Number(expModelSelect.value) : null,
                modelName: selectedOption ? selectedOption.getAttribute("data-model-name") || null : null,
                tags: expTagsInput && expTagsInput.value ? parseTags(expTagsInput.value) : [],
                logs: [],
                date: new Date().toISOString().slice(0, 10)
            };

            apiClient()
                .post("/600/experiments", payload)
                .then(function () {
                    createExpForm.reset();
                    if (createExpModal) createExpModal.hide();
                    loadExperiments();
                })
                .catch(function () {
                    if (createExpError) {
                        createExpError.textContent = "Ошибка при создании эксперимента.";
                        createExpError.classList.remove("d-none");
                    }
                });
        });
    }

    if (applyButton) applyButton.addEventListener("click", loadExperiments);
    if (resetButton) {
        resetButton.addEventListener("click", function () {
            if (dateSelect) dateSelect.value = "За всё время";
            if (metricSelect) metricSelect.value = "Любая";
            if (statusSelect) statusSelect.value = "Любой";
            if (tagInput) tagInput.value = "";
            loadExperiments();
        });
    }

    loadExperiments();
    loadModelsForSelect();
});