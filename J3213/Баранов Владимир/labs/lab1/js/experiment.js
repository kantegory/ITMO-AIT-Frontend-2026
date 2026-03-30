document.addEventListener("DOMContentLoaded", function () {
    if (!requireAuth()) return;
    setupNavbarAuth();

    const title = document.getElementById("experimentTitle");
    const nameEl = document.getElementById("expName");
    const statusEl = document.getElementById("expStatus");
    const stageEl = document.getElementById("expStage");
    const modelEl = document.getElementById("expModel");
    const authorEl = document.getElementById("expAuthor");
    const dateEl = document.getElementById("expDate");
    const tagsEl = document.getElementById("expTags");
    const descriptionEl = document.getElementById("expDescription");

    const metricsList = document.getElementById("metricsList");
    const artifactsList = document.getElementById("artifactsList");
    const logsBlock = document.getElementById("logsBlock");

    const addMetricForm = document.getElementById("addMetricForm");
    const addArtifactForm = document.getElementById("addArtifactForm");
    const addLogForm = document.getElementById("addLogForm");
    const setRunningBtn = document.getElementById("setRunningBtn");
    const setCompletedBtn = document.getElementById("setCompletedBtn");
    const setFailedBtn = document.getElementById("setFailedBtn");

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    let experiment = null;

    if (!id) {
        if (title) title.textContent = "Эксперимент не найден";
        return;
    }

    const normalizeStatus = (status) => {
        if (status === "Выполняется") return "Running";
        if (status === "Завершен") return "Completed";
        return status || "Draft";
    };

    const statusLabel = (status) => {
        const map = {
            Draft: "Черновик",
            Running: "Выполняется",
            Completed: "Завершен",
            Failed: "Ошибка"
        };
        const key = normalizeStatus(status);
        return map[key] || key;
    };

    const renderExperiment = (exp) => {
        experiment = exp;
        if (title) title.textContent = "Эксперимент #" + exp.id;
        if (nameEl) nameEl.textContent = exp.name || "-";
        if (statusEl) statusEl.textContent = statusLabel(exp.status);
        if (stageEl) stageEl.textContent = exp.stage || "-";
        if (modelEl) modelEl.textContent = exp.modelName || "-";
        if (authorEl) authorEl.textContent = exp.author || "-";
        if (dateEl) dateEl.textContent = exp.date || "-";
        if (tagsEl) tagsEl.textContent = (exp.tags || []).join(", ") || "-";
        if (descriptionEl) descriptionEl.textContent = exp.description || "-";

        const currentStatus = normalizeStatus(exp.status);
        if (setRunningBtn) setRunningBtn.disabled = currentStatus === "Running";
        if (setCompletedBtn) setCompletedBtn.disabled = currentStatus === "Completed";
        if (setFailedBtn) setFailedBtn.disabled = currentStatus === "Failed";
    };

    const renderList = (container, list, emptyText, mapper) => {
        if (!container) return;
        container.innerHTML = "";
        if (!list || list.length === 0) {
            const li = document.createElement("li");
            li.textContent = emptyText;
            container.appendChild(li);
            return;
        }
        list.forEach(function (item) {
            const li = document.createElement("li");
            li.textContent = mapper(item);
            container.appendChild(li);
        });
    };

    const renderLogs = (logs) => {
        if (!logsBlock) return;
        logsBlock.innerHTML = "";
        if (!logs || logs.length === 0) {
            logsBlock.textContent = "Логи отсутствуют";
            return;
        }
        logs.forEach(function (entry) {
            const line = document.createElement("span");
            line.textContent = entry;
            logsBlock.appendChild(line);
            logsBlock.appendChild(document.createElement("br"));
        });
    };

    const loadMetricsAndArtifacts = () => {
        apiClient()
            .get("/600/metrics", { params: { experimentId: Number(id) } })
            .then(function (res) {
                renderList(metricsList, res.data || [], "Нет метрик", function (m) {
                    return m.name + ": " + m.value;
                });
            })
            .catch(function () {
                renderList(metricsList, [], "Нет метрик", function (m) { return m.name; });
            });

        apiClient()
            .get("/600/artifacts", { params: { experimentId: Number(id) } })
            .then(function (res) {
                renderList(artifactsList, res.data || [], "Нет артефактов", function (a) {
                    return a.name + " (" + (a.type || "other") + ")";
                });
            })
            .catch(function () {
                renderList(artifactsList, [], "Нет артефактов", function (a) { return a.name; });
            });
    };

    const appendLog = (message) => {
        if (!experiment) return;
        const logs = Array.isArray(experiment.logs) ? experiment.logs.slice() : [];
        const ts = new Date().toLocaleString("ru-RU");
        logs.push("[" + ts + "] " + message);
        apiClient()
            .patch("/600/experiments/" + id, { logs: logs })
            .then(function (res) {
                experiment = res.data || experiment;
                renderLogs(experiment.logs || logs);
            });
    };

    const loadExperiment = () => {
        apiClient()
            .get("/600/experiments/" + id)
            .then(function (res) {
                const exp = res.data || {};
                renderExperiment(exp);
                renderLogs(exp.logs || []);
                loadMetricsAndArtifacts();
            })
            .catch(function () {
                if (title) title.textContent = "Эксперимент не найден";
            });
    };

    const updateStatus = (nextStatus) => {
        apiClient()
            .patch("/600/experiments/" + id, { status: nextStatus })
            .then(function (res) {
                renderExperiment(res.data || {});
                appendLog("Статус изменен на " + nextStatus);
            })
            .catch(function () {
                alert("Не удалось изменить статус.");
            });
    };

    if (setRunningBtn) setRunningBtn.addEventListener("click", function () { updateStatus("Running"); });
    if (setCompletedBtn) setCompletedBtn.addEventListener("click", function () { updateStatus("Completed"); });
    if (setFailedBtn) setFailedBtn.addEventListener("click", function () { updateStatus("Failed"); });

    if (addLogForm) {
        addLogForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const input = document.getElementById("logTextInput");
            const value = input ? input.value.trim() : "";
            if (!value) return;
            appendLog(value);
            input.value = "";
        });
    }

    if (addMetricForm) {
        addMetricForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const nameInput = document.getElementById("metricNameInput");
            const valueInput = document.getElementById("metricValueInput");
            const name = nameInput ? nameInput.value.trim() : "";
            const value = valueInput ? valueInput.value : "";
            if (!name || value === "") return;

            apiClient()
                .post("/600/metrics", {
                    userId: apiGetCurrentUserId(),
                    experimentId: Number(id),
                    name: name,
                    value: Number(value)
                })
                .then(function () {
                    if (nameInput) nameInput.value = "";
                    if (valueInput) valueInput.value = "";
                    loadMetricsAndArtifacts();
                    appendLog("Добавлена метрика " + name + "=" + value);
                })
                .catch(function () {
                    alert("Не удалось добавить метрику.");
                });
        });
    }

    if (addArtifactForm) {
        addArtifactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const nameInput = document.getElementById("artifactNameInput");
            const typeInput = document.getElementById("artifactTypeInput");
            const name = nameInput ? nameInput.value.trim() : "";
            const type = typeInput ? typeInput.value : "other";
            if (!name) return;

            apiClient()
                .post("/600/artifacts", {
                    userId: apiGetCurrentUserId(),
                    experimentId: Number(id),
                    name: name,
                    type: type,
                    createdAt: new Date().toISOString().slice(0, 10)
                })
                .then(function () {
                    if (nameInput) nameInput.value = "";
                    loadMetricsAndArtifacts();
                    appendLog("Добавлен артефакт " + name + " (" + type + ")");
                })
                .catch(function () {
                    alert("Не удалось добавить артефакт.");
                });
        });
    }

    loadExperiment();
});