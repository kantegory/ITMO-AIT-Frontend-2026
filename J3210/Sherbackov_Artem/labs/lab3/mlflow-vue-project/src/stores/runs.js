import { defineStore } from 'pinia';
import { ref } from 'vue';
import { runsApi, experimentsApi } from '@/api';

export const useRunStore = defineStore('runs', () => {
  const runs = ref([]);
  const currentExperiment = ref(null);
  const currentRun = ref(null);
  const isLoading = ref(false);

  async function fetchExperimentDetails(id) {
    isLoading.value = true;
    try {
      const [expRes, runsRes] = await Promise.all([
        experimentsApi.getAll(),
        runsApi.getByExperimentId(id)
      ]);

      const experiments = expRes.data || expRes;
      
      const found = experiments.find(e => String(e.id) === String(id));
      
      if (found) {
        currentExperiment.value = found;
        runs.value = runsRes.data || runsRes;
      } else {
        currentExperiment.value = null;
      }
    } catch (err) {
      console.error('Failed to load details:', err);
      currentExperiment.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchRunDetails(id) {
    isLoading.value = true;
    try {
      const response = await runsApi.getById(id);
      currentRun.value = response.data || response;
    } catch (err) {
      console.error('Failed to load run:', err);
      currentRun.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    runs,
    currentExperiment,
    currentRun,
    isLoading,
    fetchExperimentDetails,
    fetchRunDetails
  };
});