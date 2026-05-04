<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useExperiments, makeLog, normalizeStatus } from "@/composables/useExperiments.js";
import { useToast } from "@/composables/useToast.js";
import ExperimentFilters from "@/components/experiment/ExperimentFilters.vue";
import ExperimentTable from "@/components/experiment/ExperimentTable.vue";
import ExperimentForm from "@/components/experiment/ExperimentForm.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { list, loading, fetchAll, create, update, remove, applyFilters } = useExperiments();

const filters = ref({
    dateRange: "all",
    metric: "",
    status: route.query.status || "",
    tag: "",
});

const search = ref("");
const showCreateModal = ref(false);

const filteredList = computed(() => applyFilters(list.value, filters.value));

watch(
    () => route.query.status,
    (val) => {
        filters.value = { ...filters.value, status: val || "" };
    }
);

function resetFilters() {
    filters.value = { dateRange: "all", metric: "", status: "", tag: "" };
    if (route.query.status) router.replace({ query: {} });
}

async function load() {
    try {
        await fetchAll();
    } catch {
        toast.error("Не удалось загрузить эксперименты");
    }
}

async function onCreate(payload) {
    try {
        await create(payload);
        showCreateModal.value = false;
        toast.success("Эксперимент создан");
        await load();
    } catch {
        toast.error("Не удалось создать эксперимент");
    }
}

async function onUpdateStatus(exp, nextStatus) {
    if (normalizeStatus(exp.status) === nextStatus) return;
    const newLog = makeLog(logLevelForStatus(nextStatus), `Статус изменён на ${nextStatus}`);
    const logs = [...(exp.logs || []), newLog];
    try {
        await update(exp.id, { status: nextStatus, logs });
        toast.success(`Статус: ${nextStatus}`);
        await load();
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

async function onDelete(exp) {
    if (!confirm(`Удалить эксперимент «${exp.name}»?`)) return;
    try {
        await remove(exp.id);
        toast.success("Эксперимент удалён");
        await load();
    } catch {
        toast.error("Не удалось удалить");
    }
}

onMounted(load);
</script>

<template>
    <div class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h1 class="mb-0">Эксперименты</h1>
            <button type="button" class="btn btn-primary" @click="showCreateModal = true">
                + Новый эксперимент
            </button>
        </div>

        <ExperimentFilters v-model="filters" @reset="resetFilters" />

        <div class="mb-3">
            <input
                v-model="search"
                type="search"
                class="form-control"
                placeholder="Поиск по имени, модели или тегам..."
            />
        </div>

        <LoadingSpinner v-if="loading" />

        <div v-else>
            <EmptyState
                v-if="filteredList.length === 0 && list.length === 0"
                icon="runFast"
                title="Пока нет экспериментов"
                description="Запустите первый эксперимент, чтобы начать отслеживать метрики и логи."
            >
                <button type="button" class="btn btn-primary" @click="showCreateModal = true">
                    Создать первый
                </button>
            </EmptyState>
            <EmptyState
                v-else-if="filteredList.length === 0"
                icon="metricsDonut"
                title="Ничего не найдено"
                description="Попробуйте изменить фильтры или поисковый запрос."
            >
                <button type="button" class="btn btn-outline-secondary" @click="resetFilters">
                    Сбросить фильтры
                </button>
            </EmptyState>
            <ExperimentTable
                v-else
                :items="filteredList"
                :search="search"
                @update-status="onUpdateStatus"
                @delete="onDelete"
            />
        </div>

        <BaseModal
            v-if="showCreateModal"
            title="Новый эксперимент"
            :show="showCreateModal"
            @close="showCreateModal = false"
        >
            <ExperimentForm @submit="onCreate" @cancel="showCreateModal = false" />
        </BaseModal>
    </div>
</template>
