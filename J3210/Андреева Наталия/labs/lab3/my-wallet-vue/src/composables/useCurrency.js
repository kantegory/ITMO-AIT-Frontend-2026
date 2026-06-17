import {ref} from 'vue'
import {api} from '../api'

export function useCurrency() {
    const rates = ref(null)

    const fetchRates = async () => {
        try {
            const {data} = await api.getRates()
            rates.value = data.Valute
        } catch (e) {
            console.error("Ошибка загрузки валют", e)
        }
    }

    return {rates, fetchRates}
}