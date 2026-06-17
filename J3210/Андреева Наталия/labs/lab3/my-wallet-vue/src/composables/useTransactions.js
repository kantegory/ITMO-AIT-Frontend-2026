import {ref, computed} from 'vue'
import {api} from '../api'

export function useTransactions() {
    const transactions = ref([])
    const userId = localStorage.getItem('currentUserId')

    const fetchTransactions = async () => {
        if (!userId) return
        try {
            const response = await api.getTransactions(userId)
            transactions.value = response.data
        } catch (e) {
            console.error("Ошибка загрузки транзакций", e)
        }
    }

    const addTransaction = async (data) => {
        try {
            let cleanCat = data.cat.trim();
            if (cleanCat.length > 0) {
                cleanCat = cleanCat.charAt(0).toUpperCase() + cleanCat.slice(1).toLowerCase();
            } else {
                cleanCat = "Разное";
            }

            await api.addTransaction({...data, cat: cleanCat, userId})
            await fetchTransactions()
        } catch (e) {
            alert("Ошибка сохранения")
        }
    }

    const balance = computed(() => {
        return transactions.value.reduce((acc, t) => t.type === 'plus' ? acc + parseFloat(t.sum) : acc - parseFloat(t.sum), 0)
    })

    const expenses = computed(() => {
        return transactions.value.filter(t => t.type === 'minus').reduce((acc, t) => acc + parseFloat(t.sum), 0)
    })

    return {transactions, fetchTransactions, addTransaction, balance, expenses}
}