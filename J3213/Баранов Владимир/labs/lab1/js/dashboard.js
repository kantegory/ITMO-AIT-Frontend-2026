document.addEventListener("DOMContentLoaded", function () {
    if (!requireAuth()) return;
    setupNavbarAuth();

    const expCount = document.getElementById("expCount");
    const modelCount = document.getElementById("modelCount");
    const artifactCount = document.getElementById("artifactCount");
    const runningCount = document.getElementById("runningCount");
    const completedCount = document.getElementById("completedCount");
    const failedCount = document.getElementById("failedCount");
    const tbody = document.getElementById("dashboardExperimentsTbody");

    const setText = (el, value) => {
        if (el) el.textContent = value;
    };

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
        return map[normalizeStatus(status)] || status;
    };

    const renderLatestExperiments = (list) => {
        if (!tbody) return;
        tbody.innerHTML = "";

        if (!list || list.length === 0) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 7;
            td.textContent = "Нет экспериментов";
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        list.forEach(function (exp) {
            const tr = document.createElement("tr");
            const cells = [
                "#" + exp.id,
                exp.name || "-",
                exp.stage || "-",
                exp.modelName || "-",
                statusLabel(exp.status),
                exp.metricName && exp.metricValue !== null && exp.metricValue !== undefined
                    ? exp.metricName + ": " + exp.metricValue
                    : "-",
                exp.date || "-"
            ];

            cells.forEach(function (value) {
                const td = document.createElement("td");
                td.textContent = value;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    };

    const loadDashboard = () => {
        const userId = apiGetCurrentUserId();
        if (!userId) return;

        apiClient()
            .get("/600/experiments", { params: { userId: userId } })
            .then(function (res) {
                const list = res.data || [];
                let running = 0;
                let completed = 0;
                let failed = 0;

                list.forEach(function (exp) {
                    const s = normalizeStatus(exp.status);
                    if (s === "Running") running++;
                    if (s === "Completed") completed++;
                    if (s === "Failed") failed++;
                });

                setText(expCount, String(list.length));
                setText(runningCount, String(running));
                setText(completedCount, String(completed));
                setText(failedCount, String(failed));
            })
            .catch(function () {
                setText(expCount, "-");
                setText(runningCount, "-");
                setText(completedCount, "-");
                setText(failedCount, "-");
            });

        apiClient()
            .get("/600/models", { params: { userId: userId } })
            .then(function (res) {
                setText(modelCount, String((res.data || []).length));
            })
            .catch(function () {
                setText(modelCount, "-");
            });

        apiClient()
            .get("/600/artifacts", { params: { userId: userId } })
            .then(function (res) {
                setText(artifactCount, String((res.data || []).length));
            })
            .catch(function () {
                setText(artifactCount, "-");
            });

        apiClient()
            .get("/600/experiments", { params: { userId: userId, _sort: "date", _order: "desc", _limit: 5 } })
            .then(function (res) {
                renderLatestExperiments(res.data || []);
            })
            .catch(function () {
                renderLatestExperiments([]);
            });
    };

    loadDashboard();
});