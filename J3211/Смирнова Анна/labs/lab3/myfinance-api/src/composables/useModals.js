import { ref } from 'vue';

const activeModal = ref(null);
const modalPayload = ref(null);

export function useModals() {
    const openModal = (modalName, payload = null) => {
        modalPayload.value = payload;
        activeModal.value = modalName;
    };

    const closeModal = () => {
        activeModal.value = null;
        modalPayload.value = null;
    };

    return {
        activeModal,
        modalPayload,
        openModal,
        closeModal
    };
}