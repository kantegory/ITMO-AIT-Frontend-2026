import { ref, onBeforeUnmount } from 'vue';
import { errorText } from '../api';
export function useRequest() {
  const loading = ref(false);
  const error = ref('');
  let version = 0;
  onBeforeUnmount(() => { version++; });
  async function run(task, accept = () => {}) {
    const current = ++version;
    loading.value = true; error.value = '';
    try { const result = await task(); if (current === version) accept(result); }
    catch (e) { if (current === version) error.value = errorText(e); }
    finally { if (current === version) loading.value = false; }
  }
  return { loading, error, run };
}
