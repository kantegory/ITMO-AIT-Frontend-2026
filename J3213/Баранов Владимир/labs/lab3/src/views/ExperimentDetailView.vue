<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiClient } from "@/api/client.js";
import { useAuth } from "@/composables/useAuth.js";
import { useToast } from "@/composables/useToast.js";
import { useExperiments, makeLog, normalizeStatus } from "@/composables/useExperiments.js";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import MetricsPanel from "@/components/experiment/MetricsPanel.vue";
import ArtifactsPanel from "@/components/experiment/ArtifactsPanel.vue";
import LogsPanel from "@/components/experiment/LogsPanel.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { currentUserId } = useAuth();
const { fetchById, update } = useExperiments();

const experiment = ref(null);
const metrics = ref([]);
const artifacts = ref([]);
const loading = ref(false);

async function load() {
    loading.value = true;
    try {
        const id = route.params.id;
        const [exp, metricsResp, artifactsResp] = await Promise.all([
            fetchById(id),
            apiClient.get("/600/metrics", { params: { experimentId: id } }),
            apiClient.get("/600/artifacts", { params: { experimentId: id } }),
        ]);
        experiment.value = exp;
        metrics.value = metricsResp.data;
        artifacts.value = artifactsResp.data;
    } catch {
        toast.error("Не удалось загрузить эксперимент");
        router.push({ name: "experiments" });
    } finally {
        loading.value = false;
    }
}

watch(() => route.params.id, load);

async function onAddLog({ level, message }) {
    const newLog = makeLog(level, message);
    const logs = [...(experiment.value.logs || []), newLog];
    try {
        const updated = await update(experiment.value.id, { logs });
        experiment.value.logs = updated.logs;
    } catch {
        toast.error("Не удалось добавить лог");
    }
}

async function onUpdateStatus(nextStatus) {
    if (normalizeStatus(experiment.value.status) === nextStatus) return;
    const level = logLevelForStatus(nextStatus);
    const logs = [
        ...(experiment.value.logs || []),
        makeLog(level, `Статус изменён на ${nextStatus}`),
    ];
    try {
        const updated = await update(experiment.value.id, { status: nextStatus, logs });
        experiment.value = updated;
        toast.success(`Статус: ${nextStatus}`);
    } catch {
        toast.error("Не удалось обновить статус");
    }
}

function logLevelForStatus(status) {
    if (status === "Completed") return "success";
    if (status === "Failed") return "error";
    if (status === "Running") return "info";
    return "warn";
}

async function onAddMetric(payload) {
    try {
        const { data } = await apiClient.post("/600/metrics", {
            userId: currentUserId.value,
            experimentId: experiment.value.id,
            ...payload,
        });
        metrics.value.push(data);
        toast.success("Метрика добавлена");
        await onAddLog({ level: "info", message: `Добавлена метрика ${payload.name}=${payload.value}` });
    } catch {
        toast.error("Не удалось добавить метрику");
    }
}

async function onRemoveMetric(metric) {
    try {
        await apiClient.delete(`/600/metrics/${metric.id}`);
        metrics.value = metrics.value.filter((m) => m.id !== metric.id);
        toast.info("Метрика удалена");
    } catch {
        toast.error("Не удалось удалить метрику");
    }
}

async function onAddArtifact(payload) {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const { data } = await apiClient.post("/600/artifacts", {
            userId: currentUserId.value,
            experimentId: experiment.value.id,
            createdAt: today,
            ...payload,
        });
        artifacts.value.push(data);
        toast.success("Артефакт добавлен");
        await onAddLog({
            level: "info",
            message: `Добавлен артефакт ${payload.name} (${payload.type})`,
        });
    } catch {
        toast.error("Не удалось добавить артефакт");
    }
}

async function onRemoveArtifact(artifact) {
    try {
        await apiClient.delete(`/600/artifacts/${artifact.id}`);
        artifacts.value = artifacts.value.filter((a) => a.id !== artifact.id);
        toast.info("Артефакт удалён");
    } catch {
        toast.error("Не удалось удалить артефакт");
    }
}

onMounted(load);
</script>

<template>
    <div class="container mt-4">
        <RouterLink :to="{ name: 'experiments' }" class="d-inline-block mb-3">
            ← К списку экспериментов
        </RouterLink>

        <LoadingSpinner v-if="loading" />

        <div v-else-if="experiment" class="row g-3">
            <div class="col-lg-5">
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h1 class="h4 mb-0">{{ experiment.name }}</h1>
                            <StatusBadge :status="normalizeStatus(experiment.status)" />
                        </div>
                        <dl class="row mb-3 small">
                            <dt class="col-sm-4 text-muted">Этап</dt>
                            <dd class="col-sm-8">{{ experiment.stage }}</dd>
                            <dt class="col-sm-4 text-muted">Модель</dt>
                            <dd class="col-sm-8">
                                <RouterLink
                                    v-if="experiment.modelId"
                                    :to="{ name: 'models', query: { highlight: experiment.modelId } }"
                                >
                                    {{ experiment.modelName }}
                                </RouterLink>
                                <span v-else class="text-muted">—</span>
                            </dd>
                            <dt class="col-sm-4 text-muted">Датасет</dt>
                            <dd class="col-sm-8">
                                <span v-if="experiment.datasetName">{{ experiment.datasetName }}</span>
                                <span v-else class="text-muted">—</span>
                            </dd>
                            <dt class="col-sm-4 text-muted">Метрика</dt>
                            <dd class="col-sm-8">
                                {{ experiment.metricName }}: {{ experiment.metricValue ?? "—" }}
                            </dd>
                            <dt class="col-sm-4 text-muted">Автор</dt>
                            <dd class="col-sm-8">{{ experiment.author }}</dd>
                            <dt class="col-sm-4 text-muted">Дата</dt>
                            <dd class="col-sm-8">{{ experiment.date }}</dd>
                            <dt class="col-sm-4 text-muted">Теги</dt>
                            <dd class="col-sm-8">
                                <span
                                    v-for="t in experiment.tags || []"
                                    :key="t"
                                    class="badge bg-secondary me-1"
                                >
                                    {{ t }}
                                </span>
                                <span v-if="!(experiment.tags || []).length" class="text-muted">—</span>
                            </dd>
                        </dl>
                        <p v-if="experiment.description" class="mb-3">{{ experiment.description }}</p>

                        <div class="d-flex gap-2 flex-wrap">
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-primary"
                                :disabled="normalizeStatus(experiment.status) === 'Running'"
                                @click="onUpdateStatus('Running')"
                            >
                                Start
                            </button>
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-success"
                                :disabled="normalizeStatus(experiment.status) === 'Completed'"
                                @click="onUpdateStatus('Completed')"
                            >
                                Finish
                            </button>
                        </div>
                    </div>
                </div>

                <MetricsPanel :metrics="metrics" @add="onAddMetric" @remove="onRemoveMetric" />
                <ArtifactsPanel
                    :artifacts="artifacts"
                    @add="onAddArtifact"
                    @remove="onRemoveArtifact"
                />
            </div>

            <div class="col-lg-7">
                <LogsPanel :logs="experiment.logs || []" @add="onAddLog" />
            </div>
        </div>
    </div>
</template>
