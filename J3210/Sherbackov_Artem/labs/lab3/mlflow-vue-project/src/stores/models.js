import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { modelsApi } from '@/api';
import { useAuthStore } from './auth';

export const useModelStore = defineStore('models', () => {
  const models = ref([]);
  const isLoading = ref(false);
  const authStore = useAuthStore();
  const currentModel = ref(null);
  const modelVersions = ref([]);

  const allTags = computed(() => {
    const tags = new Set();
    models.value.forEach(m => {
      if (m.tags) m.tags.forEach(t => tags.add(t));
    });
    return Array.from(tags);
  });

  async function fetchModels() {
    const userId = authStore.user?.id || JSON.parse(localStorage.getItem('user'))?.id;
    if (!userId) return;

    isLoading.value = true;
    try {
      const response = await modelsApi.getAll();
      const allData = response.data || response;
      
      models.value = allData.filter(m => String(m.userId) === String(userId));
    } catch (err) {
      console.error('Fetch models error:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function createModel(payload) {
    try {
      const user = authStore.user || JSON.parse(localStorage.getItem('user'));
      
      const newModel = {
        name: payload.name,
        description: payload.description,
        userId: Number(user.id),
        author: user.username || 'Unknown',
        version: "v1.0",
        tags: [],
        createdAt: new Date().toISOString()
      };
      
      const response = await modelsApi.create(newModel);
      const created = response.data || response;
      
      models.value.push(created);
      return true;
    } catch (err) {
      console.error('Create model error:', err);
      return false;
    }
  }

  async function deleteModels(ids) {
    try {
      await Promise.all(ids.map(id => modelsApi.delete(id)));
      
      models.value = models.value.filter(m => !ids.includes(m.id) && !ids.includes(String(m.id)));
      return true;
    } catch (err) {
      console.error('Delete models error:', err);
      return false;
    }
  }

  async function fetchModelDetails(id) {
    isLoading.value = true;
    try {
      const modelRes = await modelsApi.getById(id);
      currentModel.value = modelRes.data || modelRes;

      const userId = authStore.user?.id || JSON.parse(localStorage.getItem('user'))?.id;
      const { experimentsApi } = await import('@/api/experiments'); 
      const expRes = await experimentsApi.getAll();
      const allExps = expRes.data || expRes;

      modelVersions.value = allExps.filter(exp => 
        String(exp.userId) === String(userId) && 
        exp.model === currentModel.value.name
      );
    } catch (err) {
      console.error('Error loading model details:', err);
      currentModel.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  const bestMetric = computed(() => {
    if (!modelVersions.value.length) return { name: 'Metric', value: '-' };
    
    return modelVersions.value.reduce((best, current) => {
      const currentVal = parseFloat(current.metricValue) || 0;
      const bestVal = parseFloat(best.value) || 0;
      if (currentVal > bestVal) {
        return { name: current.metricName || 'Metric', value: current.metricValue };
      }
      return best;
    }, { name: modelVersions.value[0].metricName || 'Metric', value: modelVersions.value[0].metricValue || '0' });
  });

  return {
    models,
    allTags,
    isLoading,
    fetchModels,
    createModel,
    deleteModels,
    currentModel, 
    modelVersions, 
    fetchModelDetails, 
    bestMetric
  };
});