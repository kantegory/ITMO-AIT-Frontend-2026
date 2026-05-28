<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ItemCard from '../components/ItemCard.vue'
import { useItems } from '../composables/useItems'

const route = useRoute()
const search = ref(route.query.q || '')
const type = ref(route.query.type || 'all')
const task = ref('all')
const { allItems, loadItems } = useItems()

onMounted(loadItems)
watch(() => route.query.q, (value) => { search.value = value || '' })

const filteredItems = computed(() => allItems.value.filter((item) => {
  const matchesText = [item.title, item.description, item.author, item.task]
    .join(' ')
    .toLowerCase()
    .includes(search.value.toLowerCase())
  const matchesType = type.value === 'all' || item.type === type.value
  const matchesTask = task.value === 'all' || item.task === task.value
  return matchesText && matchesType && matchesTask
}))
</script>

<template>
  <section class="panel">
    <h1><svg class="title-icon" aria-hidden="true"><use href="/sprite.svg#icon-search" /></svg>Каталог</h1>
    <div class="filters">
      <input v-model="search" type="search" placeholder="Введите название, автора или задачу" />
      <select v-model="type">
        <option value="all">Все типы</option>
        <option value="model">Модели</option>
        <option value="dataset">Датасеты</option>
      </select>
      <select v-model="task">
        <option value="all">Все задачи</option>
        <option value="NLP">NLP</option>
        <option value="CV">CV</option>
        <option value="Audio">Audio</option>
      </select>
    </div>
  </section>

  <div class="cards-grid catalog-grid">
    <ItemCard v-for="item in filteredItems" :key="item.id" :item="item" />
  </div>

  <p v-if="!filteredItems.length" class="empty-text">Ничего не найдено.</p>
</template>
