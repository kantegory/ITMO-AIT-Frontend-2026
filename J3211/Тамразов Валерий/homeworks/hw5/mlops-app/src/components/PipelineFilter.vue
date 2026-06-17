<template>
  <div class="filter-panel">
    <h4 class="filter-title">Фильтры</h4>

    <div class="filter-group">
      <label class="filter-label">Поиск</label>
      <input
        type="text"
        class="filter-input"
        placeholder="Название..."
        :value="search"
        @input="$emit('update:search', $event.target.value)"
      />
    </div>

    <div class="filter-group">
      <label class="filter-label">Статус</label>
      <select class="filter-input" :value="status" @change="$emit('update:status', $event.target.value)">
        <option value="all">Все</option>
        <option value="success">Успешно</option>
        <option value="running">Запущен</option>
        <option value="failed">Ошибка</option>
        <option value="pending">Ожидание</option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">Среда</label>
      <select class="filter-input" :value="env" @change="$emit('update:env', $event.target.value)">
        <option value="all">Все среды</option>
        <option value="production">Production</option>
        <option value="staging">Staging</option>
        <option value="development">Development</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PipelineFilter',
  props: {
    search: { type: String, default: '' },
    status: { type: String, default: 'all' },
    env: { type: String, default: 'all' }
  },
  emits: ['update:search', 'update:status', 'update:env']
}
</script>

<style scoped>
.filter-panel {
  background: #151c28;
  border: 1px solid #1e2a3a;
  border-radius: 4px;
  padding: 20px;
}
.filter-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: #e6edf3;
  margin: 0 0 16px 0;
}
.filter-group { margin-bottom: 14px; }
.filter-label {
  display: block;
  color: #8b949e;
  font-size: 0.8rem;
  margin-bottom: 4px;
  font-weight: 500;
}
.filter-input {
  width: 100%;
  background: #111820;
  border: 1px solid #2a3a4e;
  border-radius: 4px;
  color: #e6edf3;
  padding: 6px 10px;
  font-size: 0.85rem;
  box-sizing: border-box;
}
.filter-input:focus {
  outline: none;
  border-color: #00d4aa;
}
</style>
