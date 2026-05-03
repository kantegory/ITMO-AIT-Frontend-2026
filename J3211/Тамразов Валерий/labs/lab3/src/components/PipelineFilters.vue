<script setup>
const props = defineProps({
  filters: { type: Object, required: true }
});
const emit = defineEmits(['reset']);

const STATUS_OPTIONS = [
  { value: 'success', label: 'Успешно' },
  { value: 'running', label: 'Запущен' },
  { value: 'failed', label: 'Ошибка' },
  { value: 'pending', label: 'Ожидание' }
];

const toggleStatus = (value) => {
  const idx = props.filters.statuses.indexOf(value);
  if (idx === -1) props.filters.statuses.push(value);
  else props.filters.statuses.splice(idx, 1);
};
</script>

<template>
  <div class="sidebar-filter">
    <h5><i class="bi bi-funnel me-1"></i> Фильтры</h5>

    <div class="mb-3">
      <label class="form-label fw-semibold small">Поиск</label>
      <input
        v-model="filters.search"
        type="text"
        class="form-control form-control-sm"
        placeholder="Название пайплайна..."
      >
    </div>

    <div class="mb-3">
      <label class="form-label fw-semibold small">Статус</label>
      <div v-for="opt in STATUS_OPTIONS" :key="opt.value" class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          :id="`status-${opt.value}`"
          :checked="filters.statuses.includes(opt.value)"
          @change="toggleStatus(opt.value)"
        >
        <label class="form-check-label" :for="`status-${opt.value}`">{{ opt.label }}</label>
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label fw-semibold small">Среда</label>
      <select v-model="filters.env" class="form-select form-select-sm">
        <option value="all">Все среды</option>
        <option value="production">Production</option>
        <option value="staging">Staging</option>
        <option value="development">Development</option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label fw-semibold small">Владелец</label>
      <select v-model="filters.owner" class="form-select form-select-sm">
        <option value="all">Все</option>
        <option value="tamrazov">Тамразов В.</option>
        <option value="ivanov">Иванов А.</option>
        <option value="petrov">Петров С.</option>
      </select>
    </div>

    <button class="btn btn-outline-secondary btn-sm w-100" @click="emit('reset')">
      Сбросить фильтры
    </button>
  </div>
</template>
