<template>
  <p v-if="!experiments.length">Эксперименты не найдены.</p>
  <div v-else class="table-responsive" tabindex="0" role="region" :aria-label="caption">
    <table class="table table-striped"><caption class="visually-hidden">{{ caption }}</caption>
      <thead><tr><th scope="col">Эксперимент</th><th scope="col">Дата</th><th scope="col">Тег</th><th scope="col">Accuracy</th><th scope="col">Latency, мс</th></tr></thead>
      <tbody><tr v-for="item in experiments" :key="item.id">
        <td><RouterLink :to="'/experiments/' + item.id">{{ item.name }}</RouterLink><br><small>{{ item.id }}</small></td>
        <td>{{ item.date }}</td><td>{{ item.tag }}</td><td>{{ item.accuracy }}</td><td>{{ item.latencyMs }}</td>
      </tr></tbody>
    </table>
  </div>
</template>
<script setup>defineProps({ experiments: { type: Array, required: true }, caption: { type: String, default: 'Результаты поиска экспериментов' } });</script>
