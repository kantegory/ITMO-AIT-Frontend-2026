import { ref, shallowRef } from 'vue';
import { getUsers } from '../api/users';

const cache = shallowRef(null);
const loading = ref(false);

export function useUsers() {
  const users = ref([]);
  const error = ref(null);

  async function load(force = false) {
    if (cache.value && !force) {
      users.value = cache.value;
      return cache.value;
    }
    loading.value = true;
    try {
      const data = await getUsers();
      cache.value = data || [];
      users.value = cache.value;
      error.value = null;
      return cache.value;
    } catch (e) {
      error.value = e;
      users.value = [];
      return [];
    } finally {
      loading.value = false;
    }
  }

  return { users, loading, error, load };
}
