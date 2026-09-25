import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { experimentsApi } from '@/api';
import { useAuthStore } from './auth';

export const useExperimentStore = defineStore('experiments', () => {
  const experiments = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const authStore = useAuthStore();

  const latestExperiments = computed(() => {
    return [...experiments.value]
      .sort((a, b) => b.id - a.id)
      .slice(0, 6);
  });

  const allTags = computed(() => {
    const tags = new Set();
    experiments.value.forEach(exp => {
      if (exp.tags) exp.tags.forEach(t => tags.add(t));
    });
    return Array.from(tags);
  });

  async function fetchExperiments() {
    isLoading.value = true;
    try {
      const response = await experimentsApi.getAll();
      const allData = response.data || response; 
      const currentUserId = Number(authStore.user?.id);
      
      experiments.value = allData.filter(exp => Number(exp.userId) === currentUserId);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteExperiments(ids) {
    try {
      await Promise.all(ids.map(id => experimentsApi.delete(id)));
      experiments.value = experiments.value.filter(exp => !ids.includes(exp.id));
      return true;
    } catch (err) {
      console.error('Delete failed:', err);
      return false;
    }
  }

  async function createExperiment({ name, model }) {
    try {
      const newExp = {
        name,
        model,
        userId: Number(authStore.user.id),
        createdAt: new Date().toISOString(),
        tags: [] 
      };
      const response = await experimentsApi.create(newExp);
      const created = response.data || response; 
      experiments.value.push(created);
      return true;
    } catch (err) {
      error.value = err.message;
      return false;
    }
  }

  return {
    experiments,
    latestExperiments, 
    allTags,
    isLoading,
    error,
    fetchExperiments,
    deleteExperiments,
    createExperiment 
  };
});