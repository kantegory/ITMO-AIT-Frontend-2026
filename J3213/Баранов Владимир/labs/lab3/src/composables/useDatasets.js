import { ref } from "vue";
import { apiClient } from "@/api/client.js";
import { useAuth } from "@/composables/useAuth.js";

export function useDatasets() {
    const { currentUserId } = useAuth();
    const list = ref([]);
    const loading = ref(false);
    const error = ref(null);

    async function fetchAll() {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await apiClient.get("/600/datasets", {
                params: { userId: currentUserId.value, _sort: "date", _order: "desc" },
            });
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

    async function create(payload) {
        const today = new Date().toISOString().slice(0, 10);
        const body = {
            userId: currentUserId.value,
            date: today,
            ...payload,
        };
        const { data } = await apiClient.post("/600/datasets", body);
        return data;
    }

    async function remove(id) {
        await apiClient.delete(`/600/datasets/${id}`);
    }

    return { list, loading, error, fetchAll, create, remove };
}
