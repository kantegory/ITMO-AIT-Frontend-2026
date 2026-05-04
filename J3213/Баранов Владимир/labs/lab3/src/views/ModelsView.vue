<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useModels } from "@/composables/useModels.js";
import { useExperiments } from "@/composables/useExperiments.js";
import { useToast } from "@/composables/useToast.js";
import ModelTable from "@/components/model/ModelTable.vue";
import ModelForm from "@/components/model/ModelForm.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { list, loading, fetchAll, create, updateStatus, remove } = useModels();
const { fetchAll: fetchAllExperiments, list: experiments } = useExperiments();

const search = ref("");
const showCreateModal = ref(false);

const experimentsByModel = computed(() => {
    const counts = {};
    for (const exp of experiments.value) {
        if (exp.modelId == null) continue;
        counts[exp.modelId] = (counts[exp.modelId] || 0) + 1;
    }
    return counts;
});

const highlightId = computed(() => route.query.highlight || null);

async function load() {
    try {
        await Promise.all([fetchAll(), fetchAllExperiments()]);
    } catch {
        toast.error("Не удалось загрузить модели");
    }
}

async function onCreate(payload) {
    try {
        await create(payload);
        showCreateModal.value = false;
        toast.success("Модель зарегистрирована");
        await load();
    } catch {
        toast.error("Не удалось создать модель");
    }
}

async function onUpdateStatus(model, status) {
    try {
        await updateStatus(model.id, status);
        toast.success(`Статус: ${status}`);
        await load();
    } catch {
        toast.error("Не удалось обновить статус модели");
    }
}

async function onDelete(model) {
    if (!confirm(`Удалить модель «${model.name}»?`)) return;
    try {
        await remove(model.id);
        toast.success("Модель удалена");
        await load();
    } catch {
        toast.error("Не удалось удалить");
    }
}

function onShowExperiments(model) {
    router.push({ name: "experiments", query: { tag: model.name } });
}

onMounted(load);
</script>

<template>
    <div class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h1 class="mb-0">Модели</h1>
            <button type="button" class="btn btn-primary" @click="showCreateModal = true">
                + Зарегистрировать модель
            </button>
        </div>

        <div class="mb-3">
            <input
                v-model="search"
                type="search"
                class="form-control"
                placeholder="Поиск по имени, версии или фреймворку..."
            />
        </div>

        <LoadingSpinner v-if="loading" />

        <EmptyState
            v-else-if="list.length === 0"
            icon="cpuChip"
            title="Пока нет моделей"
            description="Зарегистрируйте первую модель, чтобы привязывать к ней эксперименты."
        >
            <button type="button" class="btn btn-primary" @click="showCreateModal = true">
                Зарегистрировать
            </button>
        </EmptyState>

        <ModelTable
            v-else
            :items="list"
            :search="search"
            :experiments-by-model="experimentsByModel"
            :highlight-id="highlightId"
            @update-status="onUpdateStatus"
            @delete="onDelete"
            @show-experiments="onShowExperiments"
        />

        <BaseModal
            v-if="showCreateModal"
            title="Регистрация модели"
            :show="showCreateModal"
            @close="showCreateModal = false"
        >
            <ModelForm @submit="onCreate" @cancel="showCreateModal = false" />
        </BaseModal>
    </div>
</template>
