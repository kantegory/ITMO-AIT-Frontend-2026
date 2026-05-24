<script setup>
import NpmCommandList from './components/NpmCommandList.vue'
import VueInfoCard from './components/VueInfoCard.vue'

const items = [
  {
    id: 1,
    type: 'model',
    name: 'Llama 3 8B Instruct',
    framework: 'Transformers',
    license: 'Llama 3 Community',
    stars: 12450,
    downloads: 890000
  },
  {
    id: 2,
    type: 'dataset',
    name: 'Common Voice (Russian)',
    framework: 'Audio Dataset',
    license: 'CC-0',
    stars: 3810,
    downloads: 156000
  }
]
</script>

<template>
  <main class="page">
    <h1>Домашняя работа 5</h1>
    <p>Изучение npm и запуск проекта на Vue 3.</p>

    <section class="grid">
      <VueInfoCard v-for="item in items" :key="item.id" :item="item" />
    </section>

    <NpmCommandList />
  </main>
</template>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px;
}

h1 {
  margin: 0 0 8px;
}

p {
  margin: 0 0 24px;
}

.grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  margin-bottom: 24px;
}
</style>
