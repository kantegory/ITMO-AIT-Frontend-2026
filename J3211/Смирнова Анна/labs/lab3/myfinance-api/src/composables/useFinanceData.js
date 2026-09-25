import { ref } from 'vue';
import { apiFetch } from '../services/api';
import { useAuth } from './useAuth';

const transactions = ref([]);
const categories = ref([]);
const goals = ref([]);
const banks = ref([]);
const rules = ref([]);
const isDataLoaded = ref(false);

export function useFinanceData() {
    const { user } = useAuth();

    const loadData = async () => {
        if (!user.value) return;
        
        try {
            const [tData, gData, cData, bData, rData] = await Promise.all([
                apiFetch(`/transactions?userId=${user.value.id}`),
                apiFetch(`/goals?userId=${user.value.id}`),
                apiFetch(`/categories?userId=${user.value.id}`),
                apiFetch(`/banks?userId=${user.value.id}`),
                apiFetch(`/rules?userId=${user.value.id}`)
            ]);
            
            transactions.value = tData.sort((a, b) => new Date(b.date) - new Date(a.date));
            goals.value = gData;
            categories.value = cData;
            banks.value = bData;
            rules.value = rData;
            
            isDataLoaded.value = true;
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
        }
    };

    return {
        transactions,
        categories,
        goals,
        banks,
        rules,
        isDataLoaded,
        loadData
    };
}