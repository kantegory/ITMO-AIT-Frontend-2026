<script setup>
import { ref, computed, onMounted } from "vue";
import { apiClient } from "@/api/client.js";
import { useAuth } from "@/composables/useAuth.js";
import { useToast } from "@/composables/useToast.js";
import { normalizeStatus } from "@/composables/useExperiments.js";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import EmptyState from "@/components/ui/EmptyState.vue";

const { currentUserId, currentUsername } = useAuth();
const toast = useToast();

const experiments = ref([]);
const modelsCount = ref(0);
const artifactsCount = ref(0);
const loading = ref(false);

const stats = computed(() => {
    const counts = { Running: 0, Completed: 0, Failed: 0, Draft: 0 };
    for (const exp of experiments.value) {
        const s = normalizeStatus(exp.status);
        if (counts[s] !== undefined) counts[s]++;
    }
    return counts;
});

const latestFive = computed(() => experiments.value.slice(0, 5));

async function load() {
    loading.value = true;
    try {
        const userId = currentUserId.value;
        const [{ data: expData }, { data: modelsData }, { data: artifactsData }] = await Promise.all([
            apiClient.get("/600/experiments", { params: { userId, _sort: "date", _order: "desc" } }),
            apiClient.get("/600/models", { params: { userId } }),
            apiClient.get("/600/artifacts", { params: { userId } }),
        ]);
        experiments.value = expData;
        modelsCount.value = modelsData.length;
        artifactsCount.value = artifactsData.length;
    } catch (e) {
        toast.error("Не удалось загрузить дашборд");
    } finally {
        loading.value = false;
    }
}

onMounted(load);
</script>

<template>
    <div class="container mt-4">
        <h1 class="mb-1">Личный кабинет</h1>
        <p class="text-muted mb-4">Привет, {{ currentUsername }}! Вот сводка по вашим работам.</p>

        <LoadingSpinner v-if="loading" />

        <div v-else>
            <div class="row g-3 mb-4">
                <div class="col-md-4">
                    <RouterLink :to="{ name: 'experiments' }" class="card stat-card h-100">
                        <div class="card-body">
                            <div class="stat-card__label">Эксперименты</div>
                            <div class="stat-card__value">{{ experiments.length }}</div>
                        </div>
                    </RouterLink>
                </div>
                <div class="col-md-4">
                    <RouterLink :to="{ name: 'models' }" class="card stat-card h-100">
                        <div class="card-body">
                            <div class="stat-card__label">Модели</div>
                            <div class="stat-card__value">{{ modelsCount }}</div>
                        </div>
                    </RouterLink>
                </div>
                <div class="col-md-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <div class="stat-card__label">Артефакты</div>
                            <div class="stat-card__value">{{ artifactsCount }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <h2 class="h5 mb-3">Статусы экспериментов</h2>
            <div class="row g-3 mb-4">
                <div class="col-md-3 col-6">
                    <RouterLink
                        :to="{ name: 'experiments', query: { status: 'Running' } }"
                        class="card stat-card h-100"
                    >
                        <div class="card-body">
                            <StatusBadge status="Running" class="mb-2" />
                            <div class="stat-card__value">{{ stats.Running }}</div>
                        </div>
                    </RouterLink>
                </div>
                <div class="col-md-3 col-6">
                    <RouterLink
                        :to="{ name: 'experiments', query: { status: 'Completed' } }"
                        class="card stat-card h-100"
                    >
                        <div class="card-body">
                            <StatusBadge status="Completed" class="mb-2" />
                            <div class="stat-card__value">{{ stats.Completed }}</div>
                        </div>
                    </RouterLink>
                </div>
                <div class="col-md-3 col-6">
                    <RouterLink
                        :to="{ name: 'experiments', query: { status: 'Failed' } }"
                        class="card stat-card h-100"
                    >
                        <div class="card-body">
                            <StatusBadge status="Failed" class="mb-2" />
                            <div class="stat-card__value">{{ stats.Failed }}</div>
                        </div>
                    </RouterLink>
                </div>
                <div class="col-md-3 col-6">
                    <RouterLink
                        :to="{ name: 'experiments', query: { status: 'Draft' } }"
                        class="card stat-card h-100"
                    >
                        <div class="card-body">
                            <StatusBadge status="Draft" class="mb-2" />
                            <div class="stat-card__value">{{ stats.Draft }}</div>
                        </div>
                    </RouterLink>
                </div>
            </div>

            <h2 class="h5 mb-3">Последние эксперименты</h2>
            <div class="card">
                <div class="card-body">
                    <EmptyState
                        v-if="latestFive.length === 0"
                        icon="runFast"
                        title="Пока нет экспериментов"
                        description="Создайте первый, чтобы начать отслеживать запуски моделей."
                    >
                        <RouterLink :to="{ name: 'experiments' }" class="btn btn-primary">
                            К экспериментам
                        </RouterLink>
                    </EmptyState>
                    <div v-else class="table-responsive">
                        <table class="table table-striped mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Статус</th>
                                    <th>Метрика</th>
                                    <th>Дата</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="exp in latestFive" :key="exp.id">
                                    <td>
                                        <RouterLink :to="`/experiments/${exp.id}`">#{{ exp.id }}</RouterLink>
                                    </td>
                                    <td>{{ exp.name }}</td>
                                    <td><StatusBadge :status="normalizeStatus(exp.status)" /></td>
                                    <td>{{ exp.metricName }}: {{ exp.metricValue ?? "—" }}</td>
                                    <td>{{ exp.date }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
