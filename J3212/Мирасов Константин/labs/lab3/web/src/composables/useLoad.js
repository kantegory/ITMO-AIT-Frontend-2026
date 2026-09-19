import { ref, shallowRef, onMounted, onScopeDispose } from 'vue';

export function useLoad(loader) {
  const data = shallowRef(null);
  const loading = ref(false);
  const error = ref(null);
  let version = 0;

  async function reload() {
    const request = ++version;
    loading.value = true;
    error.value = null;

    try {
      const result = await loader();

      if (request === version) {
        data.value = result;
      }
    } catch (cause) {
      if (request === version) {
        error.value = cause;
      }
    } finally {
      if (request === version) {
        loading.value = false;
      }
    }
  }

  onMounted(reload);
  onScopeDispose(() => {
    version++;
  });

  return { data, loading, error, reload };
}
