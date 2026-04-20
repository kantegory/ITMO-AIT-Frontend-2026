import { ref } from "vue";

function readList(key) {
    try {
        const parsed = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
        return [];
    }
}

function createCollection(key) {
    const state = ref(readList(key));

    const save = () => {
        localStorage.setItem(key, JSON.stringify(state.value));
    };

    const includes = (id) => state.value.includes(String(id));

    const toggle = (id) => {
        const normalized = String(id);
        if (includes(normalized)) {
            state.value = state.value.filter((value) => value !== normalized);
        } else {
            state.value = [...state.value, normalized];
        }
        save();
        return includes(normalized);
    };

    return {
        state,
        includes,
        toggle,
        save
    };
}

const subscriptions = createCollection("subscriptions");
const starred = createCollection("starred");

export function useUserCollections() {
    return {
        subscriptions,
        starred
    };
}
