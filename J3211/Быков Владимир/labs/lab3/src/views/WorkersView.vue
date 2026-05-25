<script setup>
import { onMounted } from 'vue';
import SvgIcon from '../components/SvgIcon.vue';
import WorkerTable from '../components/WorkerTable.vue';
import { useApiData } from '../composables/useApiData';

const {
    workers,
    isLoading,
    error,
    loadData
} = useApiData();

onMounted(loadData);
</script>

<template>
    <section aria-labelledby="workers-title">
        <div class="page-heading">
            <div>
                <h1 id="workers-title">Управление рабочими</h1>
                <p class="muted">Список исполнителей загружается из API.</p>
            </div>

            <button class="button ghost" type="button" @click="loadData">
                <SvgIcon name="icon-refresh" />
                <span>Обновить список</span>
            </button>
        </div>

        <p v-if="isLoading" class="state-message" role="status">Исполнители загружаются...</p>
        <p v-else-if="error" class="state-message error" role="alert">{{ error }}</p>
        <WorkerTable v-else :workers="workers" />
    </section>
</template>
