import { reactive, readonly } from "vue";

const toasts = reactive([]);
let nextId = 1;

function push(level, message, timeout = 3000) {
    const id = nextId++;
    toasts.push({ id, level, message });
    setTimeout(() => dismiss(id), timeout);
    return id;
}

function dismiss(id) {
    const index = toasts.findIndex((t) => t.id === id);
    if (index !== -1) toasts.splice(index, 1);
}

export function useToast() {
    return {
        toasts: readonly(toasts),
        success: (message) => push("success", message),
        error: (message) => push("error", message, 4500),
        info: (message) => push("info", message),
        dismiss,
    };
}
