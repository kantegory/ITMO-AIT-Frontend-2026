<script setup>
import { onMounted } from 'vue';
import PipelineFilters from '../components/PipelineFilters.vue';
import PipelineCard from '../components/PipelineCard.vue';
import { usePipelineFilters } from '../composables/usePipelineFilters';

const { filters, pipelines, loading, error, fetchData, reset } = usePipelineFilters();

onMounted(fetchData);
</script>

<template>
  <main class="container my-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Пайплайны CI/CD</h2>
      <button class="btn btn-primary" disabled>
        <i class="bi bi-plus-lg me-1"></i> Новый пайплайн
      </button>
    </div>

    <div class="row">
      <div class="col-lg-3 mb-4">
        <PipelineFilters :filters="filters" @reset="reset" />
      </div>

      <div class="col-lg-9">
        <p v-if="loading" class="text-muted text-center mt-4">Загрузка...</p>
        <p v-else-if="error" class="text-danger text-center mt-4">Ошибка загрузки: {{ error }}</p>
        <p v-else-if="pipelines.length === 0" class="text-muted text-center mt-3">
          Пайплайны не найдены по заданным фильтрам
        </p>
        <PipelineCard v-for="p in pipelines" :key="p.id" :pipeline="p" />
      </div>
    </div>
  </main>
</template>
