<template>
  <div class="table-responsive">
    <table class="table align-middle mb-0">
      <thead>
        <tr>
          <th>Условие</th>
          <th>Категория</th>
          <th>Действие</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading"><td colspan="4" class="text-center text-muted py-3">Загрузка...</td></tr>
        <tr v-else-if="!rules.length"><td colspan="4" class="text-center text-muted py-3">Правила не настроены</td></tr>
        <tr v-for="r in rules" :key="r.id">
          <td>{{ r.condition }} «{{ r.value }}»</td>
          <td><span class="badge bg-light text-dark">{{ r.category }}</span></td>
          <td>{{ r.action }}</td>
          <td><button type="button" class="btn btn-sm btn-outline-danger" @click="$emit('remove', r.id)">Удалить</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  rules: { type: Array, required: true },
  loading: { type: Boolean, default: false }
})
defineEmits(['remove'])
</script>
