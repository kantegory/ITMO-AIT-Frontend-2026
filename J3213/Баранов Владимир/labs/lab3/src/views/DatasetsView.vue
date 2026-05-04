<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDatasets } from "@/composables/useDatasets.js";
import { useExperiments } from "@/composables/useExperiments.js";
import { useToast } from "@/composables/useToast.js";
import DatasetTable from "@/components/dataset/DatasetTable.vue";
import DatasetForm from "@/components/dataset/DatasetForm.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";

const router = useRouter();
const toast = useToast();
const { list, loading, fetchAll, create, remove } = useDatasets();
const { fetchAll: fetchAllExperiments, list: experiments } = useExperiments();

const search = ref("");
const showCreateModal = ref(false);

const experimentsByDataset = computed(() => {
    const counts = {};
    for (const exp of experiments.value) {
        if (exp.datasetId == null) continue;
        counts[exp.datasetId] = (counts[exp.datasetId] || 0) + 1;
    }
    return counts;
});

async function load() {
    try {
        await Promise.all([fetchAll(), fetchAllExperiments()]);
    } catch {
        toast.error("Не удалось загрузить датасеты");
    }
}

async function onCreate(payload) {
    try {
        await create(payload);
        showCreateModal.value = false;
        toast.success("Датасет зарегистрирован");
        await load();
    } catch {
        toast.error("Не удалось создать датасет");
    }
}

async function onDelete(dataset) {
    if (!confirm(`Удалить датасет «${dataset.name}»?`)) return;
    try {
        await remove(dataset.id);
        toast.success("Датасет удалён");
        await load();
    } catch {
        toast.error("Не удалось удалить");
    }
}

function onShowExperiments(dataset) {
    router.push({ name: "experiments", query: { tag: dataset.name } });
}

onMounted(load);
</script>

<template>
    <div class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h1 class="mb-0">Датасеты</h1>
            <button type="button" class="btn btn-primary" @click="showCreateModal = true">
                + Зарегистрировать датасет
            </button>
        </div>

        <div class="mb-3">
            <input
                v-model="search"
                type="search"
                class="form-control"
                placeholder="Поиск по имени, типу или описанию..."
            />
        </div>

        <LoadingSpinner v-if="loading" />

        <EmptyState
            v-else-if="list.length === 0"
            icon="dataStack"
            title="Пока нет датасетов"
            description="Зарегистрируйте первый датасет, чтобы привязывать к нему эксперименты."
        >
            <button type="button" class="btn btn-primary" @click="showCreateModal = true">
                Зарегистрировать
            </button>
        </EmptyState>

        <DatasetTable
            v-else
            :items="list"
            :search="search"
            :experiments-by-dataset="experimentsByDataset"
            @delete="onDelete"
            @show-experiments="onShowExperiments"
        />

        <BaseModal
            v-if="showCreateModal"
            title="Регистрация датасета"
            :show="showCreateModal"
            @close="showCreateModal = false"
        >
            <DatasetForm @submit="onCreate" @cancel="showCreateModal = false" />
        </BaseModal>
    </div>
</template>
