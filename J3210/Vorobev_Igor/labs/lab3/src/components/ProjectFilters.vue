<template>
  <section class="filter-panel mb-4" aria-label="Фильтры проектов">
    <div class="row g-2 align-items-end">
      <div class="col-lg-5 col-md-6">
        <label for="searchInput" class="form-label small">
          Поиск
          <AppIcon name="search" :size="16" />
        </label>
        <input
          id="searchInput"
          class="form-control"
          type="search"
          placeholder="Название проекта..."
          :value="search"
          @input="$emit('update:search', $event.target.value)"
        />
      </div>

      <div class="col-lg-2 col-md-6">
        <label for="filterStatus" class="form-label small">Статус</label>
        <select id="filterStatus" class="form-select" :value="status" @change="$emit('update:status', $event.target.value)">
          <option value="">Все</option>
          <option value="Новый">Новый</option>
          <option value="В процессе">В процессе</option>
          <option value="Завершён">Завершён</option>
        </select>
      </div>

      <div class="col-lg-2 col-md-6">
        <label for="filterPriority" class="form-label small">Приоритет</label>
        <select id="filterPriority" class="form-select" :value="priority" @change="$emit('update:priority', $event.target.value)">
          <option value="">Все</option>
          <option value="Высокий">Высокий</option>
          <option value="Средний">Средний</option>
          <option value="Низкий">Низкий</option>
        </select>
      </div>

      <div class="col-lg-3 col-md-6">
        <label for="filterAssignee" class="form-label small">Исполнитель</label>
        <select id="filterAssignee" class="form-select" :value="assignee" @change="$emit('update:assignee', $event.target.value)">
          <option value="">Все</option>
          <option v-for="name in assignees" :key="name" :value="name">{{ name }}</option>
        </select>
      </div>

    </div>
  </section>
</template>

<script setup>
import AppIcon from '@/components/AppIcon.vue'

defineProps({
  search: { type: String, default: '' },
  status: { type: String, default: '' },
  priority: { type: String, default: '' },
  assignee: { type: String, default: '' },
  assignees: { type: Array, default: () => [] },
})

defineEmits(['update:search', 'update:status', 'update:priority', 'update:assignee'])
</script>
