import { ref, shallowRef } from 'vue';
import { extractErrorMessage } from '../api/client';

export function useAsync<T>(fn: () => Promise<T>, fallback = 'Что-то пошло не так') {
  const data = shallowRef<T | null>(null);
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);

  async function run(): Promise<T | null> {
    loading.value = true;
    error.value = null;
    try {
      const result = await fn();
      data.value = result;
      return result;
    } catch (err) {
      error.value = extractErrorMessage(err, fallback);
      return null;
    } finally {
      loading.value = false;
    }
  }

  return { data, error, loading, run };
}
