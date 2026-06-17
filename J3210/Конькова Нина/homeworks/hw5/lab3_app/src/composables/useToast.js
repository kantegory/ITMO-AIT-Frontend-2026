const { ref } = window.Vue;

const messages = ref([]);

export function useToast() {
    function showToast(text, variant = 'primary') {
        const toast = {
            id: Date.now() + Math.random(),
            text,
            variant
        };

        messages.value.push(toast);

        window.setTimeout(() => {
            messages.value = messages.value.filter((item) => item.id !== toast.id);
        }, 4500);
    }

    function dismissToast(id) {
        messages.value = messages.value.filter((item) => item.id !== id);
    }

    return {
        messages,
        showToast,
        dismissToast
    };
}
