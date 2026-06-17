<script setup>
import { ref, onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { getModels } from '@/api/models';
import { getDatasets } from '@/api/datasets';
import ItemCard from '@/components/ui/ItemCard.vue';

const models = ref([]);
const datasets = ref([]);
const error = ref('');

const topModels = computed(() =>
  [...models.value].sort((a, b) => b.stars - a.stars).slice(0, 3),
);
const topDatasets = computed(() =>
  [...datasets.value].sort((a, b) => b.stars - a.stars).slice(0, 3),
);

onMounted(async () => {
  try {
    const [m, d] = await Promise.all([getModels(), getDatasets()]);
    models.value = m;
    datasets.value = d;
  } catch {
    error.value = 'Не удалось загрузить данные. Убедитесь, что json-server запущен.';
  }
});
</script>

<template>
  <main id="main-content">
    <section class="hero text-center">
      <div class="container">
        <h1>Платформа для ML-моделей и датасетов</h1>
        <p class="lead col-lg-8 mx-auto">
          Находите, делитесь и обсуждайте модели машинного обучения и наборы данных.
        </p>
        <div class="d-flex justify-content-center gap-3 mt-4">
          <RouterLink to="/models" class="btn btn-accent">Смотреть модели</RouterLink>
          <RouterLink to="/datasets" class="btn btn-outline-themed">Смотреть датасеты</RouterLink>
        </div>
      </div>
    </section>

    <div v-if="error" class="container mt-3">
      <div class="alert alert-danger" role="alert">{{ error }}</div>
    </div>

    <section class="py-5">
      <div class="container">
        <h2 class="h4 mb-4">Популярные модели</h2>
        <div class="row g-4" aria-live="polite">
          <ItemCard v-for="m in topModels" :key="m.id" :item="m" type="model" />
        </div>
      </div>
    </section>

    <section class="py-5" style="background-color: var(--bg-secondary);">
      <div class="container">
        <h2 class="h4 mb-4">Популярные датасеты</h2>
        <div class="row g-4" aria-live="polite">
          <ItemCard v-for="d in topDatasets" :key="d.id" :item="d" type="dataset" />
        </div>
      </div>
    </section>
  </main>
</template>
