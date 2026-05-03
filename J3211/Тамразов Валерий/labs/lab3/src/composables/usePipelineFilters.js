import { reactive, ref, watch } from 'vue';
import { fetchPipelines } from '../api/pipelines';

const ALL_STATUSES = ['success', 'running', 'failed', 'pending'];
const OWNER_TO_USER_ID = { tamrazov: 1, ivanov: 2, petrov: 3 };

const buildParams = (filters) => {
  const params = {};
  if (filters.search.trim()) params.name_like = filters.search.trim();
  if (filters.env !== 'all') params.env = filters.env;
  if (filters.owner !== 'all' && OWNER_TO_USER_ID[filters.owner]) {
    params.userId = OWNER_TO_USER_ID[filters.owner];
  }
  if (filters.statuses.length > 0) {
    params.status = filters.statuses;
  }
  return params;
};

export function usePipelineFilters() {
  const filters = reactive({
    search: '',
    env: 'all',
    owner: 'all',
    statuses: [...ALL_STATUSES]
  });

  const pipelines = ref([]);
  const loading = ref(false);
  const error = ref(null);

  let debounceTimer = null;

  const fetchData = async () => {
    if (filters.statuses.length === 0) {
      pipelines.value = [];
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      const { data } = await fetchPipelines(buildParams(filters));
      pipelines.value = Array.isArray(data) ? data : [];
    } catch (err) {
      error.value = err.message || 'Ошибка загрузки';
      pipelines.value = [];
    } finally {
      loading.value = false;
    }
  };

  watch(
    () => filters.search,
    () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(fetchData, 250);
    }
  );

  watch(
    [() => filters.env, () => filters.owner, () => filters.statuses],
    fetchData,
    { deep: true }
  );

  const reset = () => {
    filters.search = '';
    filters.env = 'all';
    filters.owner = 'all';
    filters.statuses = [...ALL_STATUSES];
  };

  return { filters, pipelines, loading, error, fetchData, reset };
}
