import { ref } from 'vue';
import { api } from '../services/api';

export function useExperiments() {
  const experiments = ref([]);
  const isLoading = ref(false);

  async function loadExperiments() {
    isLoading.value = true;
    try {
      const { data } = await api.get('/experiments');
      experiments.value = data;
    } finally {
      isLoading.value = false;
    }
  }

  async function createExperiment(payload) {
    const { data } = await api.post('/experiments', {
      date: new Date().toISOString().split('T')[0],
      metric: null,
      status: 'Pending',
      tags: [],
      logs: [`[INFO] Experiment ${payload.name} created`],
      artifacts: [],
      params: { model_type: payload.modelType },
      metrics: { accuracy: null, loss: null },
      ...payload,
    });
    experiments.value = [data, ...experiments.value];
    return data;
  }

  return {
    experiments,
    isLoading,
    loadExperiments,
    createExperiment,
  };
}
