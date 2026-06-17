const { ref, computed } = window.Vue;
const api = window.axios;

const HUGGING_FACE_URL = 'https://huggingface.co/api/models?sort=downloads&direction=-1&limit=8';

export function useHuggingFaceModels() {
    const models = ref([]);
    const isLoading = ref(false);
    const error = ref('');

    const featuredModel = computed(() => models.value[0] || null);
    const secondaryModels = computed(() => models.value.slice(1, 4));
    const compactModels = computed(() => models.value.slice(4));

    async function fetchModels() {
        isLoading.value = true;
        error.value = '';

        try {
            const response = await api.get(HUGGING_FACE_URL);
            models.value = response.data.map((model) => ({
                id: model.id || model.modelId,
                name: (model.modelId || '').split('/').pop(),
                author: model.author || 'OpenSource',
                downloads: model.downloads || 0,
                likes: model.likes || 0,
                pipelineTag: model.pipeline_tag || 'model'
            }));
        } catch (requestError) {
            error.value = requestError.message || 'Could not load Hugging Face models';
        } finally {
            isLoading.value = false;
        }
    }

    return {
        models,
        featuredModel,
        secondaryModels,
        compactModels,
        isLoading,
        error,
        fetchModels
    };
}
