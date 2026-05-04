import { ref } from "vue";
import { apiClient } from "@/api/client.js";
import { useAuth } from "@/composables/useAuth.js";

const STATUS_NORMALIZER = {
    Выполняется: "Running",
    Завершён: "Completed",
    Завершен: "Completed",
    Ошибка: "Failed",
    Черновик: "Draft",
};

export function normalizeStatus(status) {
    if (!status) return "Draft";
    return STATUS_NORMALIZER[status] || status;
}

export function normalizeLog(rawLog) {
    if (rawLog && typeof rawLog === "object" && "message" in rawLog) {
        return {
            timestamp: rawLog.timestamp || null,
            level: rawLog.level || "info",
            message: rawLog.message,
        };
    }
    return { timestamp: null, level: "info", message: String(rawLog ?? "") };
}

export function makeLog(level, message) {
    return { timestamp: new Date().toISOString(), level, message };
}

export function useExperiments() {
    const { currentUserId, currentUsername } = useAuth();
    const list = ref([]);
    const loading = ref(false);
    const error = ref(null);

    async function fetchAll(params = {}) {
        loading.value = true;
        error.value = null;
        try {
            const query = { userId: currentUserId.value, _sort: "date", _order: "desc", ...params };
            const { data } = await apiClient.get("/600/experiments", { params: query });
            list.value = data;
            return data;
        } catch (e) {
            error.value = e;
            list.value = [];
            throw e;
        } finally {
            loading.value = false;
        }
    }

    async function fetchById(id) {
        const { data } = await apiClient.get(`/600/experiments/${id}`);
        return data;
    }

    async function create(payload) {
        const today = new Date().toISOString().slice(0, 10);
        const body = {
            userId: currentUserId.value,
            author: currentUsername.value,
            status: "Draft",
            date: today,
            tags: [],
            logs: [makeLog("info", "Эксперимент создан")],
            ...payload,
        };
        const { data } = await apiClient.post("/600/experiments", body);
        return data;
    }

    async function update(id, patch) {
        const { data } = await apiClient.patch(`/600/experiments/${id}`, patch);
        return data;
    }

    async function remove(id) {
        await apiClient.delete(`/600/experiments/${id}`);
    }

    function applyFilters(items, filters) {
        const { metric, status, tag, dateRange } = filters;
        return items.filter((exp) => {
            if (metric && exp.metricName !== metric) return false;
            if (status && normalizeStatus(exp.status) !== status) return false;
            if (tag) {
                const haystack = `${exp.name} ${(exp.tags || []).join(" ")}`.toLowerCase();
                if (!haystack.includes(tag.toLowerCase())) return false;
            }
            if (dateRange && dateRange !== "all" && !matchesDate(exp.date, dateRange)) return false;
            return true;
        });
    }

    return {
        list,
        loading,
        error,
        fetchAll,
        fetchById,
        create,
        update,
        remove,
        applyFilters,
    };
}

function matchesDate(dateStr, range) {
    if (!dateStr) return false;
    const expDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expDate.setHours(0, 0, 0, 0);
    const diffDays = (today - expDate) / (1000 * 60 * 60 * 24);
    if (range === "today") return diffDays < 1;
    if (range === "week") return diffDays < 7;
    if (range === "month") return diffDays < 31;
    return true;
}
