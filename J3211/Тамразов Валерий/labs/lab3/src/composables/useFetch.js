import { ref } from 'vue';

export function useFetch(requestFn) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);

  const execute = async (...args) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await requestFn(...args);
      data.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Ошибка запроса';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { data, error, loading, execute };
}
