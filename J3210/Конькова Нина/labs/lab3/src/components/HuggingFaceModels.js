import { useHuggingFaceModels } from '../composables/useHuggingFaceModels.js';

export default {
    name: 'HuggingFaceModels',
    setup() {
        const {
            featuredModel,
            secondaryModels,
            compactModels,
            isLoading,
            error,
            fetchModels
        } = useHuggingFaceModels();

        window.Vue.onMounted(fetchModels);

        function formatDownloads(value) {
            return Number(value || 0).toLocaleString();
        }

        return {
            featuredModel,
            secondaryModels,
            compactModels,
            isLoading,
            error,
            fetchModels,
            formatDownloads
        };
    },
    template: `
        <section aria-labelledby="hf-heading" class="mb-5">
            <div class="d-flex align-items-center justify-content-between gap-3 mb-4">
                <h2 id="hf-heading" class="h4 text-primary mb-0">
                    <i class="bi bi-fire me-2" aria-hidden="true"></i>Global Trending Models
                </h2>
                <button type="button" class="btn btn-sm btn-outline-primary" @click="fetchModels" :disabled="isLoading">
                    <i class="bi bi-arrow-clockwise me-1" aria-hidden="true"></i>Refresh
                </button>
            </div>

            <div v-if="isLoading" class="text-center py-4" role="status" aria-label="Loading models">
                <div class="spinner-border text-primary" aria-hidden="true"></div>
            </div>

            <div v-else-if="error" class="alert alert-danger">
                API Error: {{ error }}
            </div>

            <div v-else-if="featuredModel" class="hf-grid">
                <article class="card stat-card featured-model bg-primary text-white p-4">
                    <div class="card-body">
                        <span class="badge text-bg-light mb-3">{{ featuredModel.pipelineTag }}</span>
                        <h3 class="h4 fw-bold">{{ featuredModel.name }}</h3>
                        <p class="opacity-75 mb-3">{{ featuredModel.author }}</p>
                        <div class="d-flex flex-wrap gap-2">
                            <span class="badge text-bg-info">
                                <i class="bi bi-download me-1" aria-hidden="true"></i>{{ formatDownloads(featuredModel.downloads) }}
                            </span>
                            <span class="badge text-bg-light">
                                <i class="bi bi-heart me-1" aria-hidden="true"></i>{{ featuredModel.likes }}
                            </span>
                        </div>
                    </div>
                </article>

                <article
                    v-for="model in secondaryModels"
                    :key="model.id"
                    class="card stat-card shadow-sm p-3"
                >
                    <div class="card-body">
                        <h3 class="h6 fw-bold text-truncate">{{ model.name }}</h3>
                        <p class="text-muted text-truncate mb-3">{{ model.author }}</p>
                        <span class="badge text-bg-info">
                            <i class="bi bi-download me-1" aria-hidden="true"></i>{{ formatDownloads(model.downloads) }}
                        </span>
                    </div>
                </article>

                <article
                    v-for="model in compactModels"
                    :key="model.id"
                    class="card stat-card compact-model p-3"
                >
                    <h3 class="h6 fw-bold text-truncate mb-1">{{ model.name }}</h3>
                    <small class="text-muted">{{ formatDownloads(model.downloads) }} downloads</small>
                </article>
            </div>
        </section>
    `
};
