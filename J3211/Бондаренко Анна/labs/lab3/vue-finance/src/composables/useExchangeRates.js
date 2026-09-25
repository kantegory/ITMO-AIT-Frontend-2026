import { ref } from 'vue'
import { financeApi } from '../api'

export function useExchangeRates() {
    const rates = ref(null)
    const error = ref(null)
    const isLoading = ref(false)

    const fetchRates = async () => {
        isLoading.value = true
        error.value = null
        try {
            rates.value = await financeApi.getExchangeRates()
        } catch (e) {
            error.value = 'Не удалось загрузить курсы валют'
            console.error(e)
        } finally {
            isLoading.value = false
        }
    }

    return { rates, error, isLoading, fetchRates }
}