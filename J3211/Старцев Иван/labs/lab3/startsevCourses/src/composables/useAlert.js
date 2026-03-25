import { ref } from 'vue'

export const useAlert = () => {
    const alert = ref({
        type: '',
        text: '',
        visible: false,
    })

    const showAlert = (type, text) => {
        alert.value = {
            type,
            text,
            visible: true,
        }
    }

    const hideAlert = () => {
        alert.value = {
            type: '',
            text: '',
            visible: false,
        }
    }

    return {
        alert,
        showAlert,
        hideAlert,
    }
}
