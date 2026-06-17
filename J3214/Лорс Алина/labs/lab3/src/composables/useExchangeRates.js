import { ref } from 'vue';
import { exchangeApi } from '../services/api';

const rates = ref(null);
const loading = ref(false);
const error = ref('');

export function useExchangeRates() {
  async function loadRates(base = 'EUR') {
    const quotes = ['EUR', 'USD', 'RUB'].filter((item) => item !== base);
    loading.value = true;
    error.value = '';
    try {
      const { data } = await exchangeApi.get('/rates', {
        params: {
          base,
          quotes: quotes.join(',')
        }
      });
      rates.value = {
        base,
        updatedAt: new Date().toISOString(),
        items: Array.isArray(data) ? data : []
      };
    } catch (err) {
      error.value = 'Курсы валют не загрузились. Это внешнее API, поэтому при отсутствии интернета блок можно оставить как пример axios-запроса.';
    } finally {
      loading.value = false;
    }
  }

  return { rates, loading, error, loadRates };
}
